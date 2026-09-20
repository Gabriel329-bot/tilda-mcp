import { TEMPLATES } from '../templates/html-templates.js';
import { getIcon, ICONS } from '../templates/icons.js';
import { ThemeTokens, getThemeTokens } from '../templates/theme-tokens.js';

export function applyTokens(html: string, theme: ThemeTokens): string {
  return html
    .replace(/\{\{THEME_ACCENT\}\}/g, theme.accent)
    .replace(/\{\{THEME_ACCENT_HOVER\}\}/g, theme.accentHover)
    .replace(/\{\{THEME_ACCENT_GLOW\}\}/g, theme.accentGlow)
    .replace(/\{\{THEME_RADIUS_CARD\}\}/g, theme.radiusCard)
    .replace(/\{\{THEME_RADIUS_BTN\}\}/g, theme.radiusBtn)
    .replace(/\{\{THEME_BG_PAGE\}\}/g, theme.bgPageLight)
    .replace(/\{\{THEME_BG_CARD\}\}/g, theme.bgCardLight)
    .replace(/\{\{THEME_BORDER\}\}/g, theme.borderLight)
    .replace(/\{\{THEME_FONT\}\}/g, theme.fontFamily);
}

function resolveTheme(theme?: ThemeTokens | string, data?: any): ThemeTokens {
  if (theme && typeof theme === 'object' && 'accent' in theme) {
    return theme;
  }
  if (typeof theme === 'string') {
    return getThemeTokens(theme);
  }
  if (data?.theme || data?.style_preset) {
    return getThemeTokens(data.theme || data.style_preset);
  }
  return getThemeTokens('dji');
}

export class TemplateEngine {
  static renderHero(data: any, bgImage: string, theme?: ThemeTokens | string): string {
    const activeTheme = resolveTheme(theme, data);
    const html = TEMPLATES.hero
      .replace('{{BG_IMAGE}}', bgImage)
      .replace('{{BADGE}}', data.badge || 'ИНЖЕНЕРНЫЙ ЦЕНТР')
      .replace('{{TITLE}}', data.title || '')
      .replace('{{SUBTITLE}}', data.descr || data.subtitle || '')
      .replace('{{BTN1_TEXT}}', data.btn1?.text || data.btn_text || 'Выбрать профиль')
      .replace('{{BTN1_HREF}}', data.btn1?.href || data.btn_href || '#features')
      .replace('{{BTN2_TEXT}}', data.btn2?.text || data.btn2_text || 'Условия приема')
      .replace('{{BTN2_HREF}}', data.btn2?.href || data.btn2_href || '#pricing');

    return applyTokens(html, activeTheme);
  }

  static renderBento(data: any, theme?: ThemeTokens | string): string {
    const activeTheme = resolveTheme(theme, data);
    const cards = (data.items || []).map((item: any) => {
      return TEMPLATES.bentoCard
        .replace('{{ICON_SVG}}', getIcon(item.title))
        .replace('{{TITLE}}', item.title || '')
        .replace('{{DESCR}}', item.descr || '');
    }).join('\n');

    const html = TEMPLATES.bentoContainer
      .replace('{{SECTION_TITLE}}', data.title || 'Оснащение полигонов')
      .replace('{{SECTION_DESCR}}', data.descr || '')
      .replace('{{CARDS}}', cards);

    return applyTokens(html, activeTheme);
  }

  static renderMetrics(data: any, theme?: ThemeTokens | string): string {
    const activeTheme = resolveTheme(theme, data);
    const items = (data.items || []).map((item: any) => {
      return TEMPLATES.metricItem
        .replace('{{VALUE}}', item.num || item.title || '')
        .replace('{{LABEL}}', item.descr || '');
    }).join('\n');

    const html = TEMPLATES.metricsContainer
      .replace('{{SECTION_TITLE}}', data.title || 'Показатели')
      .replace('{{SECTION_DESCR}}', data.descr || '')
      .replace('{{ITEMS}}', items);

    return applyTokens(html, activeTheme);
  }

  static renderPricing(data: any, theme?: ThemeTokens | string): string {
    const activeTheme = resolveTheme(theme, data);
    const plans = (data.plans || []).map((plan: any) => {
      const isFeatured = plan.is_featured;
      const borderClass = isFeatured
        ? `border-2 border-[${activeTheme.accent}] shadow-md bg-white`
        : `border ${activeTheme.borderLight}`;
      const badge = isFeatured
        ? `<span class="px-2.5 py-0.5 ${activeTheme.radiusCard} bg-blue-50 text-[${activeTheme.accent}] text-xs font-semibold uppercase">Выбор года</span>`
        : '';
      const btnStyle = isFeatured
        ? `bg-[${activeTheme.accent}] hover:bg-[${activeTheme.accentHover}] text-white shadow-md`
        : 'bg-slate-200 hover:bg-slate-300 text-slate-800';

      const featuresList = (plan.features || []).map((f: string) => `
        <li class="flex items-start gap-3 text-sm text-slate-700">
          <span class="mt-0.5 flex-shrink-0 text-[${activeTheme.accent}]">${ICONS.check}</span>
          <span>${f}</span>
        </li>
      `).join('');

      return TEMPLATES.pricingCard
        .replace('{{PLAN_NAME}}', plan.name || '')
        .replace('{{BORDER_CLASS}}', borderClass)
        .replace('{{FEATURED_BADGE}}', badge)
        .replace('{{PRICE}}', plan.price || '0 ₽')
        .replace('{{PERIOD}}', plan.period || '')
        .replace('{{FEATURES_LIST}}', featuresList)
        .replace('{{BTN_STYLE}}', btnStyle)
        .replace('{{BTN_TEXT}}', plan.btn_text || 'Подать заявку');
    }).join('\n');

    const html = TEMPLATES.pricingContainer
      .replace('{{SECTION_TITLE}}', data.title || 'Формы обучения')
      .replace('{{SECTION_DESCR}}', data.descr || '')
      .replace('{{PLANS}}', plans);

    return applyTokens(html, activeTheme);
  }

  static renderFAQ(data: any, theme?: ThemeTokens | string): string {
    const activeTheme = resolveTheme(theme, data);
    const items = (data.items || []).map((item: any) => {
      return TEMPLATES.faqItem
        .replace('{{QUESTION}}', item.question || item.title || '')
        .replace('{{ANSWER}}', item.answer || item.descr || '');
    }).join('\n');

    const html = TEMPLATES.faqContainer
      .replace('{{SECTION_TITLE}}', data.title || 'Часто задаваемые вопросы')
      .replace('{{SECTION_DESCR}}', data.descr || '')
      .replace('{{ITEMS}}', items);

    return applyTokens(html, activeTheme);
  }

  static renderContact(data: any, webhookUrl?: string, theme?: ThemeTokens | string): string {
    const activeTheme = resolveTheme(theme, data);
    const html = TEMPLATES.contactSection
      .replace('{{TITLE}}', data.title || 'Запись на ознакомительный визит')
      .replace('{{DESCR}}', data.descr || '')
      .replace('{{BTN_TEXT}}', data.btn_text || 'Записаться на визит')
      .replace('{{WEBHOOK_URL}}', webhookUrl || data.webhook_url || '');

    return applyTokens(html, activeTheme);
  }
}
