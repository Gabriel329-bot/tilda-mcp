import crypto from 'crypto';
import { BlockPayload, PackagedBlock, ValidationResult } from '../types/index.js';
import { validateBlockGuardrails, scopeCss } from './guardrails.js';

export interface PackageBlockOptions {
  autoScopeCss?: boolean;
  strictValidation?: boolean;
}

/**
 * Packages HTML markup, CSS styles, and JS logic into an isolated, self-contained
 * snippet ready for injection into a Tilda T123 (HTML-код) block.
 */
export function packageBlock(
  payload: BlockPayload,
  options: PackageBlockOptions = { autoScopeCss: true, strictValidation: false }
): { packaged: PackagedBlock; validation: ValidationResult } {
  // Generate a random unique ID for the block scope
  const uniqueHash = crypto.randomBytes(4).toString('hex');
  const containerId = `block-ai-${uniqueHash}`;

  let processedHtml = payload.htmlMarkup.trim();
  let processedCss = payload.cssStyles.trim();
  const processedJs = (payload.jsCode || '').trim();

  // If root markup does not have the container ID, wrap it in a container
  if (!processedHtml.includes(containerId)) {
    // If the HTML already has a root element with class 'ai-custom-section', add id
    if (processedHtml.startsWith('<div') && !processedHtml.includes('id=')) {
      processedHtml = processedHtml.replace(
        '<div',
        `<div id="${containerId}" data-ai-block="${escapeAttr(payload.blockName)}"`
      );
    } else {
      processedHtml = `
<div id="${containerId}" class="ai-custom-section" data-ai-block="${escapeAttr(payload.blockName)}">
${processedHtml}
</div>`.trim();
    }
  }

  // Ensure CSS is scoped
  if (options.autoScopeCss) {
    processedCss = scopeCss(processedCss, containerId);
  }

  // Validate against guardrails
  const validation = validateBlockGuardrails(containerId, processedCss, processedHtml);

  if (options.strictValidation && !validation.valid) {
    const errorMsgs = validation.issues
      .filter((i) => i.type === 'error')
      .map((i) => i.message)
      .join('; ');
    throw new Error(`Block failed guardrails validation: ${errorMsgs}`);
  }

  // Build isolated script wrapper if JS is present
  const scriptTag = processedJs
    ? `
<script>
(function() {
  'use strict';
  function initBlock() {
    var root = document.getElementById('${containerId}');
    if (!root) return;
    try {
      ${processedJs}
    } catch (err) {
      console.error('[Tilda-AI Block: ${escapeAttr(payload.blockName)}] Script error:', err);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlock);
  } else {
    initBlock();
  }
})();
</script>`.trim()
    : '';

  // Combine into single T123 HTML code snippet
  const fullSnippet = `
<!-- ========================================== -->
<!-- AI Custom Block: ${escapeComment(payload.blockName)} -->
<!-- Container: #${containerId} -->
<!-- ========================================== -->

${processedHtml}

<style>
/* Reset & Base Isolation for #${containerId} */
#${containerId} {
  box-sizing: border-box;
  width: 100%;
  position: relative;
}
#${containerId} *,
#${containerId} *::before,
#${containerId} *::after {
  box-sizing: inherit;
}

${processedCss}
</style>

${scriptTag}
`.trim();

  return {
    packaged: {
      blockId: uniqueHash,
      containerId,
      fullSnippet,
    },
    validation,
  };
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function escapeComment(str: string): string {
  return str.replace(/-->/g, '-- >');
}

import { MediaOrchestrator } from './media-orchestrator.js';
import { TemplateEngine } from './template-engine.js';
import { ThemeTokens, getThemeTokens } from '../templates/theme-tokens.js';
import { SeoOrchestrator } from './seo-orchestrator.js';
import { AnalyticsOptions, AnalyticsOrchestrator } from './analytics-orchestrator.js';

export const TAILWIND_HEADER_CDN = `<script src="https://cdn.tailwindcss.com"></script><link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

export interface T123BlockPackage {
  tplId: 'T123';
  fields: {
    code: string;
    rawcod: string;
  };
}

export type HeroBlockPackage = T123BlockPackage;

/**
 * Packages the Hero section into a custom Design Engine T123 block,
 * resolving media via MediaOrchestrator and generating studio Tailwind HTML
 * with critical image preload, Schema.org JSON-LD, Analytics tracking, and global CRO overlays.
 */
export function packageHeroSection(
  data: any,
  niche = 'telecom',
  includeCdn = true,
  theme?: string | ThemeTokens,
  seoData?: any,
  croOptions?: any,
  analytics?: AnalyticsOptions
): T123BlockPackage {
  const orchestrator = new MediaOrchestrator();
  const backgroundUrl = data.backgroundUrl || data.bg_image_url || orchestrator.resolveHeroImage(niche);
  const resolvedTheme: ThemeTokens = typeof theme === 'string' ? getThemeTokens(theme) : theme || getThemeTokens('dji');
  const fontUrl = resolvedTheme.fontImportUrl || 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap';

  let heroHtml = TemplateEngine.renderHero(data, backgroundUrl, theme);

  let prefix = '';
  if (analytics) {
    prefix += `${AnalyticsOrchestrator.generateAnalyticsSnippet(analytics)}\n`;
  }
  if (includeCdn) {
    prefix += `<script src="https://cdn.tailwindcss.com"></script>\n<link href="${fontUrl}" rel="stylesheet">\n`;
  }
  if (backgroundUrl) {
    prefix += `<link rel="preload" as="image" href="${backgroundUrl}">\n`;
  }

  const effectiveSeo = seoData || {
    title: data.title || 'Landing Page',
    descr: data.descr || data.subtitle || '',
    faq: data.faq,
    pricing: data.pricing,
  };
  prefix += `${SeoOrchestrator.generateJsonLd(effectiveSeo)}\n`;

  const croHtml = TemplateEngine.renderCroOverlays(croOptions, theme);
  const fullHtml = `${prefix}${heroHtml}\n${croHtml}`;

  return {
    tplId: 'T123',
    fields: {
      code: fullHtml,
      rawcod: fullHtml,
    },
  };
}

/**
 * Packages the Marquee / Tech Stack section into a custom studio T123 block.
 */
export function packageMarqueeSection(items?: string[], theme?: string | ThemeTokens): T123BlockPackage {
  const html = TemplateEngine.renderMarquee(items, theme);
  return {
    tplId: 'T123',
    fields: {
      code: html,
      rawcod: html,
    },
  };
}

/**
 * Packages the Timeline / How It Works section into a custom studio T123 block.
 */
export function packageTimelineSection(data: any, theme?: string | ThemeTokens): T123BlockPackage {
  const html = TemplateEngine.renderTimeline(data, theme);
  return {
    tplId: 'T123',
    fields: {
      code: html,
      rawcod: html,
    },
  };
}

/**
 * Packages the Calculator section into a custom studio T123 block.
 */
export function packageCalculatorSection(data: any, theme?: string | ThemeTokens): T123BlockPackage {
  const html = TemplateEngine.renderCalculator(data, theme);
  return {
    tplId: 'T123',
    fields: {
      code: html,
      rawcod: html,
    },
  };
}

/**
 * Packages the Bento Features section into a custom studio T123 block.
 */
export function packageFeaturesSection(data: any, theme?: string | ThemeTokens): T123BlockPackage {
  const html = TemplateEngine.renderBento(data, theme);
  return {
    tplId: 'T123',
    fields: {
      code: html,
      rawcod: html,
    },
  };
}

/**
 * Packages the Metrics section into a custom studio T123 block.
 */
export function packageMetricsSection(data: any, theme?: string | ThemeTokens): T123BlockPackage {
  const html = TemplateEngine.renderMetrics(data, theme);
  return {
    tplId: 'T123',
    fields: {
      code: html,
      rawcod: html,
    },
  };
}

/**
 * Packages the Pricing section into a custom studio T123 block.
 */
export function packagePricingSection(data: any, theme?: string | ThemeTokens): T123BlockPackage {
  const html = TemplateEngine.renderPricing(data, theme);
  return {
    tplId: 'T123',
    fields: {
      code: html,
      rawcod: html,
    },
  };
}

/**
 * Packages the Contact / Form section into a custom studio T123 block.
 */
export function packageContactSection(
  data: any,
  webhookUrl?: string,
  theme?: string | ThemeTokens,
  successMessage?: string
): T123BlockPackage {
  const html = TemplateEngine.renderContact(data, webhookUrl, theme, successMessage);
  return {
    tplId: 'T123',
    fields: {
      code: html,
      rawcod: html,
    },
  };
}

/**
 * Packages the FAQ Accordion section into a custom studio T123 block.
 */
export function packageFaqSection(data: any, theme?: string | ThemeTokens): T123BlockPackage {
  const html = TemplateEngine.renderFAQ(data, theme);
  return {
    tplId: 'T123',
    fields: {
      code: html,
      rawcod: html,
    },
  };
}

export type FooterBlockPackage = T123BlockPackage;

/**
 * Packages the Footer section into a custom studio T123 block.
 */
export function packageFooterSection(projectName: string, theme?: string | ThemeTokens): T123BlockPackage {
  const html = TemplateEngine.renderFooter(projectName, theme);
  return {
    tplId: 'T123',
    fields: {
      code: html,
      rawcod: html,
    },
  };
}
