import { Page } from 'playwright';
import { TIMEOUTS } from '../config.js';

export interface AceInjectionResult {
  success: boolean;
  length: number;
  strategyUsed: string;
}

/**
 * Robustly injects code into Tilda's embedded Ace Editor using in-page JS evaluation.
 * Completely bypasses keyboard simulation to avoid character drops, lag, and auto-bracket anomalies.
 */
export async function setAceEditorValue(
  page: Page,
  code: string,
  timeoutMs: number = TIMEOUTS.ACE_READY
): Promise<AceInjectionResult> {
  // Wait for editor element to appear in DOM
  await page.waitForSelector('.ace_editor, #editor, textarea.ace_text-input', {
    state: 'visible',
    timeout: timeoutMs,
  });

  // Evaluate injection directly inside page execution context
  const result = await page.evaluate((newCode: string): AceInjectionResult => {
    // Strategy 1: Global window.ace instance via .ace_editor DOM element
    const aceContainers = Array.from(
      document.querySelectorAll<HTMLElement>('.ace_editor, #editor, [id^="ace_"]')
    );

    for (const container of aceContainers) {
      // Check for attached env.editor
      if ((container as any).env && (container as any).env.editor) {
        const editor = (container as any).env.editor;
        editor.setValue(newCode, -1);
        editor.clearSelection();
        if (editor.session && editor.session._emit) {
          editor.session._emit('change');
        }
        return {
          success: true,
          length: editor.getValue().length,
          strategyUsed: 'container.env.editor',
        };
      }

      // Check via window.ace.edit
      if ((window as any).ace && typeof (window as any).ace.edit === 'function') {
        try {
          const editor = (window as any).ace.edit(container);
          if (editor) {
            editor.setValue(newCode, -1);
            editor.clearSelection();
            if (editor.session && editor.session._emit) {
              editor.session._emit('change');
            }
            return {
              success: true,
              length: editor.getValue().length,
              strategyUsed: 'window.ace.edit(container)',
            };
          }
        } catch {
          // continue to next strategy
        }
      }
    }

    // Strategy 2: Check any global editor objects stored on window
    const possibleGlobalKeys = ['aceEditor', 'editor', 'ace_editor', 'myCodeMirror'];
    for (const key of possibleGlobalKeys) {
      const candidate = (window as any)[key];
      if (candidate && typeof candidate.setValue === 'function') {
        candidate.setValue(newCode, -1);
        return {
          success: true,
          length: (candidate.getValue ? candidate.getValue().length : newCode.length),
          strategyUsed: `window.${key}`,
        };
      }
    }

    // Strategy 3: Fallback to hidden Ace input textarea or regular textarea
    const textareas = Array.from(
      document.querySelectorAll<HTMLTextAreaElement>(
        'textarea.ace_text-input, textarea[name="code"], #editrecord textarea'
      )
    );

    for (const textarea of textareas) {
      textarea.value = newCode;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      return {
        success: true,
        length: textarea.value.length,
        strategyUsed: 'textarea.value injection',
      };
    }

    throw new Error(
      'Could not locate Ace Editor instance or textarea in Tilda content modal.'
    );
  }, code);

  // Short pause to ensure change events propagate to Tilda's internal state
  await page.waitForTimeout(300);

  return result;
}
