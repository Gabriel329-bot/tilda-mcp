import { TEMPLATES } from '../templates/html-templates.js';
import { getIcon, ICONS } from '../templates/icons.js';
import { ThemeTokens, getThemeTokens } from '../templates/theme-tokens.js';

export function applyTokens(html: string, theme: ThemeTokens): string {
  const bgPage = theme.bgPage || theme.bgPageLight || 'bg-white';
  const bgCard = theme.bgCard || theme.bgCardLight || 'bg-[#F8FAFC]';
  const border = theme.border || theme.borderLight || 'border-slate-200/80';
  const textPrimary = theme.textPrimary || 'text-slate-900';
  const textSecondary = theme.textSecondary || 'text-slate-500';

  return html
    .replace(/\{\{THEME_ACCENT\}\}/g, theme.accent)
    .replace(/\{\{THEME_ACCENT_HOVER\}\}/g, theme.accentHover)
    .replace(/\{\{THEME_ACCENT_GLOW\}\}/g, theme.accentGlow)
    .replace(/\{\{THEME_RADIUS_CARD\}\}/g, theme.radiusCard)
    .replace(/\{\{THEME_RADIUS_BTN\}\}/g, theme.radiusBtn)
    .replace(/var\(--card-radius\)/g, theme.radiusCard)
    .replace(/var\(--btn-radius\)/g, theme.radiusBtn)
    .replace(/\{\{THEME_BG_PAGE\}\}/g, bgPage)
    .replace(/\{\{THEME_BG_CARD\}\}/g, bgCard)
    .replace(/\{\{THEME_BORDER\}\}/g, border)
    .replace(/\{\{THEME_TEXT_PRIMARY\}\}/g, textPrimary)
    .replace(/\{\{THEME_TEXT_SECONDARY\}\}/g, textSecondary)
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
    const isLight = !activeTheme.isDark || activeTheme.id === 'light' || activeTheme.id === 'apple';
    const template = isLight ? TEMPLATES.heroLight : TEMPLATES.hero;

    const html = template
      .replace('{{BG_IMAGE}}', bgImage)
      .replace('{{BADGE}}', data.badge || (isLight ? 'Apple Ecosystem' : 'ИНЖЕНЕРНЫЙ ЦЕНТР'))
      .replace('{{TITLE}}', data.title || '')
      .replace('{{SUBTITLE}}', data.descr || data.subtitle || '')
      .replace('{{BTN1_TEXT}}', data.btn1?.text || data.btn_text || 'Начать бесплатно')
      .replace('{{BTN1_HREF}}', data.btn1?.href || data.btn_href || '#form')
      .replace('{{BTN2_TEXT}}', data.btn2?.text || data.btn2_text || (isLight ? 'Узнать больше' : 'Условия приема'))
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
      const badgeText = plan.badge || (isFeatured ? 'Рекомендуем' : '');
      const badge = badgeText
        ? `<span class="px-2.5 py-0.5 ${activeTheme.radiusCard} bg-[${activeTheme.accent}]/10 text-[${activeTheme.accent}] text-xs font-semibold uppercase">${badgeText}</span>`
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

      const rawPrice = plan.price || '0 ₽';
      const numMatch = rawPrice.replace(/\s/g, '').match(/\d+/);
      const num = numMatch ? parseInt(numMatch[0], 10) : 0;
      let priceMonth = rawPrice;
      let priceYear = rawPrice;
      if (num > 0) {
        const discountedMonthly = Math.round(num * 0.8);
        const currency = rawPrice.includes('$') ? ' $' : rawPrice.includes('€') ? ' €' : ' ₽';
        priceMonth = `${num.toLocaleString('ru-RU')}${currency}`.replace(/\u00a0/g, ' ');
        priceYear = `${discountedMonthly.toLocaleString('ru-RU')}${currency}`.replace(/\u00a0/g, ' ');
      }

      return TEMPLATES.pricingCard
        .replace('{{PLAN_NAME}}', plan.name || '')
        .replace('{{BORDER_CLASS}}', borderClass)
        .replace('{{FEATURED_BADGE}}', badge)
        .replace('{{PRICE}}', priceMonth)
        .replace('{{PRICE_MONTH}}', priceMonth)
        .replace('{{PRICE_YEAR}}', priceYear)
        .replace('{{PERIOD}}', plan.period || 'месяц')
        .replace('{{FEATURES_LIST}}', featuresList)
        .replace('{{BTN_STYLE}}', btnStyle)
        .replace('{{BTN_TEXT}}', plan.btn_text || 'Выбрать тариф');
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

  static renderContact(
    data: any,
    webhookUrl?: string,
    theme?: ThemeTokens | string,
    successMessage?: string
  ): string {
    const activeTheme = resolveTheme(theme, data);
    const isLight = !activeTheme.isDark || activeTheme.id === 'light' || activeTheme.id === 'apple';
    const template = isLight ? TEMPLATES.contactSectionLight : TEMPLATES.contactSection;

    const badge = data.badge || (isLight ? 'Связаться с нами' : 'Контакты и связь');
    const contactsBadgeBg = isLight ? 'bg-white border border-black/[0.06] shadow-sm' : 'bg-white/5';
    const contactsHtml = data.contacts
      ? data.contacts.map((c: any) => `
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-full ${contactsBadgeBg} flex items-center justify-center text-[${activeTheme.accent}]">${c.icon || '•'}</span>
          <span>${c.text}</span>
        </div>
      `).join('')
      : `
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-full ${contactsBadgeBg} flex items-center justify-center text-[${activeTheme.accent}]">📍</span>
          <span>${data.address || 'Офис разработки & Design HQ'}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-full ${contactsBadgeBg} flex items-center justify-center text-[${activeTheme.accent}]">📞</span>
          <span>${data.phone || '+7 (495) 800-20-40'}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-full ${contactsBadgeBg} flex items-center justify-center text-[${activeTheme.accent}]">✉️</span>
          <span>${data.email || 'support@studio.cloud'}</span>
        </div>
      `;

    const formSuccessText =
      successMessage ||
      data.success_message ||
      data.success_text ||
      'Наш специалист свяжется с вами в ближайшее время по указанному номеру телефона.';

    const html = template
      .replace('{{BADGE}}', badge)
      .replace('{{TITLE}}', data.title || 'Связаться с нами')
      .replace('{{DESCR}}', data.descr || '')
      .replace('{{CONTACTS_LIST}}', contactsHtml)
      .replace('{{BTN_TEXT}}', data.btn_text || 'Отправить заявку')
      .replace('{{WEBHOOK_URL}}', webhookUrl || data.webhook_url || '')
      .replace('{{FORM_SUCCESS_TEXT}}', formSuccessText);

    return applyTokens(html, activeTheme);
  }

  static renderFooter(projectName: string, theme?: ThemeTokens | string): string {
    const activeTheme = resolveTheme(theme);
    const isLight = !activeTheme.isDark || activeTheme.id === 'light' || activeTheme.id === 'apple';
    const template = isLight ? TEMPLATES.footerSectionLight : TEMPLATES.footerSection;
    const year = new Date().getFullYear().toString();
    const html = template
      .replace(/\{\{PROJECT_NAME\}\}/g, projectName || 'DevTools Cloud')
      .replace(/\{\{YEAR\}\}/g, year);

    return applyTokens(html, activeTheme);
  }

  static renderMarquee(items?: string[], theme?: ThemeTokens | string): string {
    const activeTheme = resolveTheme(theme);
    const defaultItems = [
      'Next.js',
      'PostgreSQL',
      'Kubernetes',
      'Redis',
      'Docker',
      'ClickHouse',
      'Tailwind CSS',
      'TypeScript',
      'GraphQL',
      'Prometheus',
    ];
    const activeItems = items && items.length > 0 ? items : defaultItems;
    const itemsHtml = activeItems
      .map(
        (it) =>
          `<span class="flex items-center gap-3"><span>${it}</span><span class="text-slate-600 opacity-60">•</span></span>`
      )
      .join('\n');

    const html = TEMPLATES.marqueeSection.replace(/\{\{ITEMS\}\}/g, itemsHtml);

    return applyTokens(html, activeTheme);
  }

  static renderTimeline(data: any, theme?: ThemeTokens | string): string {
    const activeTheme = resolveTheme(theme, data);
    const defaultSteps = [
      { step: '01', title: 'Аудит и планирование', descr: 'Анализ текущей инфраструктуры и формирование технических требований.' },
      { step: '02', title: 'Проектирование архитектуры', descr: 'Разработка отказоустойчивой топологии сервисов и схем данных.' },
      { step: '03', title: 'Развертывание и тесты', descr: 'Настройка пайплайнов автоматического деплоя и нагрузочное тестирование.' },
      { step: '04', title: 'Запуск и поддержка 24/7', descr: 'Бесшовный ввод в эксплуатацию с постоянным мониторингом доступности.' },
    ];
    const stepsData = data?.steps && data.steps.length > 0 ? data.steps : defaultSteps;
    const stepsHtml = stepsData
      .map((step: any, idx: number) => {
        const stepNum = step.step || step.step_num || (idx + 1).toString().padStart(2, '0');
        return TEMPLATES.timelineStep
          .replace('{{STEP_NUM}}', String(stepNum))
          .replace('{{STEP_TITLE}}', step.title || '')
          .replace('{{STEP_DESCR}}', step.descr || '');
      })
      .join('\n');

    const html = TEMPLATES.timelineSection
      .replace('{{TITLE}}', data?.title || 'Как мы работаем')
      .replace('{{DESCR}}', data?.descr || 'Поэтапный процесс интеграции и запуска проектов')
      .replace('{{STEPS}}', stepsHtml);

    return applyTokens(html, activeTheme);
  }

  static renderCalculator(data?: any, theme?: ThemeTokens | string): string {
    const activeTheme = resolveTheme(theme, data);
    const html = TEMPLATES.calculatorSection
      .replace('{{TITLE}}', data?.title || 'Калькулятор стоимости инфраструктуры')
      .replace('{{DESCR}}', data?.descr || 'Рассчитайте предварительный бюджет под ваши объемы');

    return applyTokens(html, activeTheme);
  }

  static renderCroOverlays(options?: any, theme?: ThemeTokens | string): string {
    if (options?.enabled === false) {
      return '';
    }

    const activeTheme = resolveTheme(theme);
    const enableSticky = options?.enable_sticky_bar !== false;
    const enableSocial = options?.enable_social_toast !== false;
    const enableCookie = options?.enable_cookie_banner !== false;

    if (!enableSticky && !enableSocial && !enableCookie) {
      return '';
    }

    const stickyTitle = options?.stickyTitle || options?.sticky_title || 'Готовы начать?';
    const stickySubtitle = options?.stickySubtitle || options?.sticky_subtitle || 'Тестовый период 14 дней бесплатно';
    const stickyBtn = options?.stickyBtn || options?.sticky_btn || 'Начать бесплатно';
    const socialProofMsg = options?.socialProofMsg || options?.social_proof_msg || 'Алексей (FinTech) только что подключил кластер';

    const parts: string[] = [];

    if (enableSticky) {
      parts.push(`
<style>@media (max-width: 639px) { body { padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px)) !important; } }</style>
<!-- Sticky Mobile CTA Bar -->
<div id="sticky-mobile-cta" style="padding-bottom: max(12px, env(safe-area-inset-bottom, 12px));" class="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden flex items-center justify-between shadow-lg">
  <div class="flex flex-col pr-3">
    <span class="text-xs font-semibold text-slate-900 leading-tight">${stickyTitle}</span>
    <span class="text-[10px] text-slate-500">${stickySubtitle}</span>
  </div>
  <a href="#form" class="h-9 px-5 inline-flex items-center justify-center {{THEME_RADIUS_BTN}} bg-[{{THEME_ACCENT}}] hover:bg-[{{THEME_ACCENT_HOVER}}] text-white font-medium text-xs shadow-md whitespace-nowrap">
    ${stickyBtn}
  </a>
</div>`);
    }

    if (enableSocial) {
      parts.push(`
<!-- Social Proof Toast -->
<div id="social-proof-toast" class="fixed bottom-5 left-5 z-40 max-w-sm rounded-lg bg-slate-900 text-white p-3.5 shadow-xl border border-white/10 text-xs hidden sm:flex items-center gap-3 transition-opacity duration-300">
  <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold">✓</div>
  <div class="flex-1">
    <p class="font-medium text-slate-200" id="toast-message">${socialProofMsg}</p>
    <p class="text-[10px] text-slate-400" id="toast-time">Только что</p>
  </div>
  <button type="button" onclick="document.getElementById('social-proof-toast').remove()" class="text-slate-400 hover:text-white p-1 text-sm leading-none cursor-pointer">&times;</button>
</div>`);
    }

    if (enableCookie) {
      parts.push(`
<!-- Cookie Consent Banner -->
<div id="cookie-consent-banner" class="fixed bottom-20 sm:bottom-4 right-4 z-40 max-w-md bg-white border border-slate-200 rounded-xl p-4 shadow-xl text-xs text-slate-600 hidden items-center justify-between gap-4">
  <p class="leading-normal">Мы используем файлы cookie для персонализации сервиса и аналитики.</p>
  <button type="button" onclick="acceptCookies()" class="px-4 py-2 {{THEME_RADIUS_BTN}} bg-slate-900 hover:bg-black text-white text-xs font-semibold whitespace-nowrap shadow-sm cursor-pointer">
    Принять
  </button>
</div>`);
    }

    const scripts: string[] = [];
    if (enableCookie) {
      scripts.push(`function acceptCookies() {
  if (typeof localStorage !== 'undefined') localStorage.setItem('cookie_consent', 'accepted');
  var b = document.getElementById('cookie-consent-banner');
  if (b) b.remove();
}`);
    }

    const initLines: string[] = [];
    if (enableCookie) {
      initLines.push(`  if (typeof localStorage !== 'undefined' && !localStorage.getItem('cookie_consent')) {
    var b = document.getElementById('cookie-consent-banner');
    if (b) {
      b.classList.remove('hidden');
      b.classList.add('flex');
    }
  }`);
    }
    if (enableSocial) {
      initLines.push(`  var toast = document.getElementById('social-proof-toast');
  if (toast) {
    setTimeout(function() {
      toast.style.opacity = '0';
      setTimeout(function() { if (toast && toast.parentNode) toast.remove(); }, 500);
    }, 8000);
  }`);
    }

    if (scripts.length > 0 || initLines.length > 0) {
      parts.push(`
<script>
${scripts.join('\n')}
(function() {
${initLines.join('\n')}
})();
</script>`);
    }

    const html = parts.join('\n');
    return applyTokens(html.trim(), activeTheme);
  }
}
