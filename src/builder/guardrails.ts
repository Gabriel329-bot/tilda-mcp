import { ValidationResult, ValidationIssue } from '../types/index.js';

const FORBIDDEN_GLOBAL_TAGS = [
  'html',
  'body',
  ':root',
  '*',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'a',
  'button',
  'input',
  'textarea',
  'ul',
  'ol',
  'li',
  'img',
  'svg',
  'section',
  'header',
  'footer',
  'main',
  'nav',
];

/**
 * Validates CSS and HTML markup against Tilda isolation and responsiveness guardrails.
 */
export function validateBlockGuardrails(
  containerId: string,
  css: string,
  html: string
): ValidationResult {
  const issues: ValidationIssue[] = [];

  // 1. Zero Collision check: ensure root container presence in HTML
  if (!html.includes(containerId)) {
    issues.push({
      type: 'error',
      rule: 'zero-collision-container',
      message: `HTML markup must contain the unique root container ID '#${containerId}' or class '${containerId}'.`,
    });
  }

  // 2. Global style pollution check: clean comments and media queries first
  const cleanCss = css
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/@media[^{]+\{([\s\S]+?\})\s*\}/g, '$1'); // flatten media queries for inspection

  // Find all CSS rule selectors (before opening bracket `{`)
  const selectorMatches = cleanCss.match(/([^{}]+)\s*\{/g) || [];

  for (const match of selectorMatches) {
    const rawSelector = match.replace('{', '').trim();
    if (rawSelector.startsWith('@')) continue; // Skip at-rules

    // Check individual selectors separated by comma
    const subSelectors = rawSelector.split(',').map((s) => s.trim());

    for (const sub of subSelectors) {
      if (!sub) continue;

      // Check if sub-selector references containerId
      const hasContainerScope =
        sub.includes(`#${containerId}`) ||
        sub.includes(`.${containerId}`) ||
        sub.startsWith(`[id^="block-"]`);

      if (!hasContainerScope) {
        // Check if selector starts with forbidden global tag
        const firstToken = sub.split(/[\s>+~]/)[0].toLowerCase();
        if (FORBIDDEN_GLOBAL_TAGS.includes(firstToken)) {
          issues.push({
            type: 'error',
            rule: 'no-global-styles',
            message: `Unscoped global selector '${sub}' detected. All rules must be scoped under '#${containerId}'.`,
          });
        } else {
          issues.push({
            type: 'warning',
            rule: 'unscoped-selector',
            message: `Selector '${sub}' is not explicitly scoped with '#${containerId}'. Prefix it to prevent style leaks.`,
          });
        }
      }
    }
  }

  // 3. Responsiveness check: check for presence of Tilda standard breakpoints
  const hasBreakpoint1200 = /@media[^(]*\(\s*max-width\s*:\s*1200px\s*\)/i.test(css);
  const hasBreakpoint960 = /@media[^(]*\(\s*max-width\s*:\s*960px\s*\)/i.test(css);
  const hasBreakpoint640 = /@media[^(]*\(\s*max-width\s*:\s*640px\s*\)/i.test(css);
  const hasBreakpoint480 = /@media[^(]*\(\s*max-width\s*:\s*480px\s*\)/i.test(css);

  const missingBreakpoints: string[] = [];
  if (!hasBreakpoint960) missingBreakpoints.push('960px (tablet landscape)');
  if (!hasBreakpoint640) missingBreakpoints.push('640px (tablet portrait)');
  if (!hasBreakpoint480) missingBreakpoints.push('480px (mobile)');

  if (missingBreakpoints.length > 0) {
    issues.push({
      type: 'warning',
      rule: 'tilda-responsive-breakpoints',
      message: `Recommended Tilda breakpoints missing: ${missingBreakpoints.join(', ')}. Ensure mobile viewport (390px) renders cleanly.`,
    });
  }

  return {
    valid: issues.filter((i) => i.type === 'error').length === 0,
    issues,
  };
}

/**
 * Automatically prepends the container ID to any unscoped CSS selectors.
 * Guarantees zero-collision even if LLM missed scoping a selector.
 */
export function scopeCss(css: string, containerId: string): string {
  const scopePrefix = `#${containerId}`;

  // Process CSS while preserving @media blocks and keyframes
  return css.replace(
    /(@media[^{]+\{)([\s\S]+?\})(\s*\})/gi,
    (_, mediaStart, innerRules, mediaEnd) => {
      const scopedInner = scopeRuleList(innerRules, scopePrefix);
      return `${mediaStart}${scopedInner}${mediaEnd}`;
    }
  ).replace(
    /^([^@{}]+)\{/gm,
    (match, selector) => {
      const scoped = scopeSelectorList(selector, scopePrefix);
      return `${scoped} {`;
    }
  );
}

function scopeRuleList(rulesBlock: string, prefix: string): string {
  return rulesBlock.replace(/([^{}]+)\{/g, (_, selector) => {
    const trimmed = selector.trim();
    if (trimmed.startsWith('@')) return `${selector}{`;
    return `${scopeSelectorList(selector, prefix)} {`;
  });
}

function scopeSelectorList(selectors: string, prefix: string): string {
  return selectors
    .split(',')
    .map((item) => {
      const s = item.trim();
      if (!s) return '';
      if (s.includes(prefix)) return s;
      return `${prefix} ${s}`;
    })
    .join(', ');
}
