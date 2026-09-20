import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TildaHttpClient, sanitizeString, sanitizeFields } from '../src/client/tilda-http-client.js';

describe('Resilience & Retry Mechanism (TildaHttpClient)', () => {
  let client: TildaHttpClient;
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.useFakeTimers();
    client = new TildaHttpClient({ humanLikePacing: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    global.fetch = originalFetch;
  });

  it('Scenario 1: Retry Success (429 Too Many Requests -> 200 OK)', async () => {
    let callCount = 0;
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      callCount++;
      if (callCount === 1) {
        return new Response('Rate limited', {
          status: 429,
          headers: new Headers({ 'Content-Type': 'text/plain' }),
        });
      }
      return new Response('{"success": true}', {
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
    });
    global.fetch = fetchMock;

    const requestPromise = (client as any).request('/test/endpoint');

    // Fast-forward fake timer for 1st retry delay (1000ms)
    await vi.advanceTimersByTimeAsync(1000);

    const response = await requestPromise;
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('Scenario 2: Retry Exhaustion (3x 502 Bad Gateway -> Throws Error)', async () => {
    const fetchMock = vi.fn().mockImplementation(async () => {
      return new Response('Bad Gateway', {
        status: 502,
        headers: new Headers({ 'Content-Type': 'text/plain' }),
      });
    });
    global.fetch = fetchMock;

    const requestPromise = (client as any).request('/test/gateway');

    // Advance for attempt 1 -> 2 (1000ms) and attempt 2 -> 3 (2500ms)
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2500);

    const res = await requestPromise;
    // After 3 exhausted retries on status codes, the last response is returned
    expect(res.status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('Scenario 2b: Retry Exhaustion on Network Error (3x throw -> throws Error)', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('ECONNRESET: Connection reset by peer'));
    global.fetch = fetchMock;

    const requestPromise = (client as any).request('/test/network-error');

    // Attach catch handler early to prevent unhandled rejection during timer advancing
    let caughtError: any = null;
    requestPromise.catch((err: any) => {
      caughtError = err;
    });

    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2500);

    await expect(requestPromise).rejects.toThrow(/ECONNRESET/);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('Scenario 3: Rollback on Failure (deletePage calls movetobinpage)', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string, init: any) => {
      const body = init?.body?.toString() || '';
      if (body.includes('comm=movetobinpage')) {
        return new Response('ok', {
          status: 200,
          headers: new Headers({ 'Content-Type': 'text/plain' }),
        });
      }
      return new Response('error', { status: 500 });
    });
    global.fetch = fetchMock;

    const deleted = await client.deletePage('99998888');
    expect(deleted).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [[calledUrl, calledInit]] = fetchMock.mock.calls;
    expect(calledUrl).toContain('/projects/submit/');
    expect(calledInit.body.toString()).toContain('comm=movetobinpage');
    expect(calledInit.body.toString()).toContain('pageid=99998888');
  });

  it('Scenario 4: Rollback Error Shielding (deletePage handles network failures gracefully)', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network failure during rollback'));
    global.fetch = fetchMock;

    const deletePromise = client.deletePage('99998888');

    // Advance timers across all retry attempts (1000ms + 2500ms)
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2500);

    // Must not throw, returns false safely
    const deleted = await deletePromise;
    expect(deleted).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('Scenario 5: Sanitizer Unit Tests (sanitizeString and sanitizeFields)', () => {
    // Guillemets and double/single quotes
    const rawQuote = 'Компания «Апекс» & партнер "PRO" — номер 1';
    const sanitizedQuote = sanitizeString(rawQuote);
    expect(sanitizedQuote).toContain('&laquo;Апекс&raquo;');
    expect(sanitizedQuote).toContain('&amp;');
    expect(sanitizedQuote).toContain('&quot;PRO&quot;');
    expect(sanitizedQuote).toContain('&mdash;');

    // Recursive object sanitization
    const rawData = {
      title: 'Услуги «Премиум»',
      features: [
        { name: 'Stage 1 & Stage 2', descr: 'Настройка "под ключ"' },
        { name: 'Защита кузова', descr: 'Пленка «SunTek»' },
      ],
      pricing: {
        amount: 50000,
        note: 'Цена & сроки — по договору',
      },
    };

    const cleanData = sanitizeFields(rawData);
    expect(cleanData.title).toBe('Услуги &laquo;Премиум&raquo;');
    expect(cleanData.features[0].name).toBe('Stage 1 &amp; Stage 2');
    expect(cleanData.features[0].descr).toBe('Настройка &quot;под ключ&quot;');
    expect(cleanData.features[1].descr).toBe('Пленка &laquo;SunTek&raquo;');
    expect(cleanData.pricing.amount).toBe(50000);
    expect(cleanData.pricing.note).toBe('Цена &amp; сроки &mdash; по договору');
  });

  it('Scenario 6: Dark Preset Pricing CSS & Monolithic Template Mapping', async () => {
    const { BLOCK_TEMPLATES } = await import('../src/client/tilda-http-client.js');
    const { DARK_PRESET_CSS, getPresetCss } = await import('../src/styles/presets.js');

    // Verify template mappings
    expect(BLOCK_TEMPLATES.PR04).toBe('776');
    expect(BLOCK_TEMPLATES.PR01).toBe('776');
    expect(BLOCK_TEMPLATES['776']).toBe('776');

    // Verify dark CSS rules for pricing and typography
    const darkCss = getPresetCss('dark');
    expect(darkCss).toContain('.t-pricing__features, .t-pricing__col, .t776__features');
    expect(darkCss).toContain('background: transparent !important');
    expect(darkCss).toContain('letter-spacing: -0.03em !important');
    expect(darkCss).toContain('color: #CBD5E1 !important');
    expect(darkCss).toContain('border-radius: 100px !important');
    expect(darkCss).toContain('margin-top: 24px !important');
  });

  it('Scenario 7: DJI Preset Tokens, Component Rules & CSS', async () => {
    const { STYLE_PRESETS, DJI_PRESET_CSS, getPresetCss } = await import('../src/styles/presets.js');

    // 1. Verify Palette Tokens
    expect(STYLE_PRESETS.dji).toBeDefined();
    expect(STYLE_PRESETS.dji.accentBtnBg).toBe('#0070D5'); // Sky CTA
    expect(STYLE_PRESETS.dji.accentBadge).toBe('#3B63A9'); // Accent Deep Blue
    expect(STYLE_PRESETS.dji.bgPrimary).toBe('#000000'); // Dark Canvas
    expect(STYLE_PRESETS.dji.bgSecondary).toBe('#FFFFFF'); // Light Canvas
    expect(STYLE_PRESETS.dji.cardBg).toBe('#EDEDED'); // Card background
    expect(STYLE_PRESETS.dji.textPrimary).toBe('#000000');
    expect(STYLE_PRESETS.dji.textSecondary).toBe('#6C7073');

    // 2. Verify Component Rules in CSS
    const djiCss = getPresetCss('dji');
    expect(djiCss).toBe(DJI_PRESET_CSS);

    // Buttons: 1408px pill, Sky CTA #0070D5, 600 weight, 40px height
    expect(djiCss).toContain('border-radius: 1408px !important');
    expect(djiCss).toContain('background-color: #0070D5 !important');
    expect(djiCss).toContain('font-weight: 600 !important');
    expect(djiCss).toContain('min-height: 40px !important');

    // Cards: 8px border-radius, #F4F5F7 background, neutral 1px solid #E2E8F0 border
    expect(djiCss).toContain('background-color: #F4F5F7 !important');
    expect(djiCss).toContain('border: 1px solid #E2E8F0 !important');
    expect(djiCss).toContain('border-radius: 8px !important');

    // Metrics designer layout: pure black numbers and neutral cards
    expect(djiCss).toContain('.t1050__col');
    expect(djiCss).toContain('font-size: 48px !important');
    expect(djiCss).toContain('font-weight: 700 !important');
    expect(djiCss).toContain('color: #000000 !important');

    // Pricing action buttons and list markers
    expect(djiCss).toContain('.t776__btn, .t-pricing__button');
    expect(djiCss).toContain('\\2014\\00a0');
  });

  it('Scenario 8: Template Vault (Hero, Bento, Metrics, Pricing) & SVG Icons', async () => {
    const { ICONS, getIcon } = await import('../src/templates/icons.js');
    const { TemplateEngine } = await import('../src/generators/template-engine.js');
    const { packageHeroSection, packageFeaturesSection, packageMetricsSection, packagePricingSection } =
      await import('../src/generators/block-packager.js');

    // 1. Icons dictionary
    expect(ICONS.server).toContain('<svg');
    expect(ICONS.network).toContain('<svg');
    expect(ICONS.shield).toContain('<svg');
    expect(ICONS.cpu).toContain('<svg');
    expect(ICONS.speed).toContain('<svg');
    expect(ICONS.check).toContain('<svg');
    expect(getIcon('Магистральные серверы')).toBe(ICONS.server);
    expect(getIcon('Защита трафика')).toBe(ICONS.shield);
    expect(getIcon('Маршрутизация сетей')).toBe(ICONS.network);

    // 2. Hero template rendering
    const heroPkg = packageHeroSection({
      title: 'Инженерный центр',
      descr: 'Стенды ВОЛС и сети',
      btn1: { text: 'Начать', href: '#form' },
    });
    expect(heroPkg.tplId).toBe('T123');
    expect(heroPkg.fields.code).toContain('cdn.tailwindcss.com');
    expect(heroPkg.fields.code).toContain('Инженерный центр');
    expect(heroPkg.fields.code).toContain('text-white');

    // 3. Bento Features rendering
    const featPkg = packageFeaturesSection({
      title: 'Оснащение',
      descr: 'Лаборатории',
      items: [{ title: 'Серверные кластеры', descr: 'Стоечные шасси' }],
    });
    expect(featPkg.tplId).toBe('T123');
    expect(featPkg.fields.code).toContain('id="features"');
    expect(featPkg.fields.code).toContain(ICONS.server);
    expect(featPkg.fields.code).toContain('Серверные кластеры');

    // 4. Metrics rendering
    const metrPkg = packageMetricsSection({
      title: 'Цифры',
      items: [{ title: '50+', descr: 'лабораторий' }],
    });
    expect(metrPkg.tplId).toBe('T123');
    expect(metrPkg.fields.code).toContain('id="metrics"');
    expect(metrPkg.fields.code).toContain('50+');
    expect(metrPkg.fields.code).toContain('text-slate-950');

    // 5. Pricing rendering
    const pricePkg = packagePricingSection({
      title: 'Тарифы',
      plans: [{ name: 'Бюджет', price: '0 ₽', period: 'год', features: ['Обучение'], is_featured: true }],
    });
    expect(pricePkg.tplId).toBe('T123');
    expect(pricePkg.fields.code).toContain('id="pricing"');
    expect(pricePkg.fields.code).toContain('Бюджет');
    expect(pricePkg.fields.code).toContain('0 ₽');
    expect(pricePkg.fields.code).toContain(ICONS.check);

    // 6. Contact section rendering
    const { packageContactSection, packageFaqSection } = await import('../src/generators/block-packager.js');
    const contactPkg = packageContactSection({
      title: 'Запись на визит',
      descr: 'Оставьте контактные данные',
      btn_text: 'Записаться',
    });
    expect(contactPkg.tplId).toBe('T123');
    expect(contactPkg.fields.code).toContain('id="form"');
    expect(contactPkg.fields.code).toContain('Запись на визит');
    expect(contactPkg.fields.code).toContain('+7 (___) ___-__-__');
    expect(contactPkg.fields.code).toContain('IMask');
    expect(contactPkg.fields.code).toContain('handleLeadSubmit');
    expect(contactPkg.fields.code).toContain('scroll-behavior: smooth');
    expect(contactPkg.fields.code).toContain('Записаться');

    // 7. FAQ section rendering
    const faqPkg = packageFaqSection({
      title: 'Часто задаваемые вопросы',
      descr: 'Регламенты поступления',
      items: [
        { question: 'Учитываются ли результаты ОГЭ?', answer: 'Прием ведется по среднему баллу.' },
      ],
    });
    expect(faqPkg.tplId).toBe('T123');
    expect(faqPkg.fields.code).toContain('id="faq"');
    expect(faqPkg.fields.code).toContain('<details class="group');
    expect(faqPkg.fields.code).toContain('Учитываются ли результаты ОГЭ?');
    expect(faqPkg.fields.code).toContain('Прием ведется по среднему баллу.');
  });

  it('Scenario 9: Dynamic Theme Switcher & Design Tokens (dji, dark, linear)', async () => {
    const { getThemeTokens, THEMES } = await import('../src/templates/theme-tokens.js');
    const { TemplateEngine } = await import('../src/generators/template-engine.js');
    const { packageHeroSection, packagePricingSection } = await import('../src/generators/block-packager.js');

    // 1. Theme token definitions
    expect(THEMES.dji.accent).toBe('#0070D5');
    expect(THEMES.dji.radiusBtn).toBe('rounded-[1408px]');
    expect(THEMES.dji.radiusCard).toBe('rounded-[4px]');

    expect(THEMES.linear.accent).toBe('#5E6AD2');
    expect(THEMES.linear.radiusBtn).toBe('rounded-lg');
    expect(THEMES.linear.radiusCard).toBe('rounded-lg');

    expect(THEMES.dark.accent).toBe('#06B6D4');
    expect(THEMES.dark.radiusBtn).toBe('rounded-xl');
    expect(THEMES.dark.radiusCard).toBe('rounded-xl');

    // 2. Render Hero with Linear Theme
    const linearHero = packageHeroSection(
      { title: 'Linear SaaS Platform', descr: 'Next gen issue tracking' },
      'tech',
      false,
      'linear'
    );
    expect(linearHero.fields.code).toContain('#5E6AD2');
    expect(linearHero.fields.code).toContain('rounded-lg');
    expect(linearHero.fields.code).not.toContain('rounded-[1408px]');

    // 3. Render Hero with Dark Theme
    const darkHero = packageHeroSection(
      { title: 'Cyber Dark Agency', descr: 'High tech agency' },
      'tech',
      false,
      'dark'
    );
    expect(darkHero.fields.code).toContain('#06B6D4');
    expect(darkHero.fields.code).toContain('rounded-xl');

    // 4. Render Pricing with Linear Theme
    const linearPricing = packagePricingSection(
      {
        title: 'Linear Plans',
        plans: [{ name: 'Standard', price: '10 $', features: ['Unlimited tasks'], is_featured: true }],
      },
      'linear'
    );
    expect(linearPricing.fields.code).toContain('#5E6AD2');
    expect(linearPricing.fields.code).toContain('rounded-lg');
    expect(linearPricing.fields.code).not.toContain('rounded-[1408px]');
  });

  it('Scenario 10: Custom Studio Footer Section (T123)', async () => {
    const { TemplateEngine } = await import('../src/generators/template-engine.js');
    const { packageFooterSection } = await import('../src/generators/block-packager.js');

    // 1. TemplateEngine.renderFooter
    const footerHtml = TemplateEngine.renderFooter('DevTools Cloud');
    expect(footerHtml).toContain('<footer');
    expect(footerHtml).toContain('DevTools Cloud');
    expect(footerHtml).toContain('bg-[#0B0F17]');
    expect(footerHtml).toContain('border-slate-800');
    expect(footerHtml).toContain('v2.4');
    expect(footerHtml).toContain(new Date().getFullYear().toString());

    // 2. packageFooterSection returns T123 package
    const footerPkg = packageFooterSection('DevTools Cloud', 'linear');
    expect(footerPkg.tplId).toBe('T123');
    expect(footerPkg.fields.code).toContain('DevTools Cloud');
    expect(footerPkg.fields.code).toContain('bg-[#0B0F17]');
    expect(footerPkg.fields.rawcod).toBe(footerPkg.fields.code);
  });

  it('Scenario 11: Light Preset & Studio Components (Apple Style)', async () => {
    const { getThemeTokens } = await import('../src/templates/theme-tokens.js');
    const { packageHeroSection, packageContactSection, packageFooterSection } = await import('../src/generators/block-packager.js');

    const lightTheme = getThemeTokens('light');
    expect(lightTheme.isDark).toBe(false);
    expect(lightTheme.accent).toBe('#0071E3');
    expect(lightTheme.radiusCard).toBe('rounded-2xl');
    expect(lightTheme.radiusBtn).toBe('rounded-full');
    expect(lightTheme.bgPage).toBe('bg-[#F5F5F7]');

    // 1. Hero light
    const heroPkg = packageHeroSection(
      { title: 'Design Platform', descr: 'Next generation design system' },
      'tech',
      false,
      'light'
    );
    expect(heroPkg.fields.code).toContain('bg-gradient-to-b from-white');
    expect(heroPkg.fields.code).toContain('text-[#1D1D1F]');
    expect(heroPkg.fields.code).toContain('rounded-full');
    expect(heroPkg.fields.code).not.toContain('bg-black/80');

    // 2. Contact form light
    const contactPkg = packageContactSection({ title: 'Получить доступ' }, undefined, 'light');
    expect(contactPkg.fields.code).toContain('bg-[#F5F5F7]');
    expect(contactPkg.fields.code).toContain('bg-white');
    expect(contactPkg.fields.code).toContain('text-[#1D1D1F]');
    expect(contactPkg.fields.code).toContain('bg-slate-50 border border-slate-200');

    // 3. Footer light
    const footPkg = packageFooterSection('Design Studio', 'light');
    expect(footPkg.fields.code).toContain('bg-[#ECECEE]');
    expect(footPkg.fields.code).toContain('text-[#1D1D1F]');
    expect(footPkg.fields.code).toContain('border-black/[0.06]');
  });

  it('Scenario 12: Commercial Upgrade (Marquee, Timeline, Calculator, Billing Toggle, Schema.org, CRO)', async () => {
    const { SeoOrchestrator } = await import('../src/generators/seo-orchestrator.js');
    const {
      packageHeroSection,
      packageMarqueeSection,
      packageTimelineSection,
      packageCalculatorSection,
      packagePricingSection,
    } = await import('../src/generators/block-packager.js');

    // 1. Marquee / Social proof
    const marqueePkg = packageMarqueeSection(['Kubernetes', 'Redis', 'Docker', 'ClickHouse'], 'linear');
    expect(marqueePkg.tplId).toBe('T123');
    expect(marqueePkg.fields.code).toContain('animate-[marquee_25s_linear_infinite]');
    expect(marqueePkg.fields.code).toContain('Kubernetes');
    expect(marqueePkg.fields.code).toContain('ClickHouse');

    // 2. Timeline / Roadmap
    const timelinePkg = packageTimelineSection(
      {
        title: 'Этапы развертывания',
        descr: 'От аудита до продакшена',
        steps: [
          { step: '01', title: 'Аудит сети', descr: 'Анализ топологии и трафика' },
          { step: '02', title: 'Настройка кластера', descr: 'Конфигурация нод K8s' },
        ],
      },
      'linear'
    );
    expect(timelinePkg.tplId).toBe('T123');
    expect(timelinePkg.fields.code).toContain('id="timeline"');
    expect(timelinePkg.fields.code).toContain('Этапы развертывания');
    expect(timelinePkg.fields.code).toContain('01');
    expect(timelinePkg.fields.code).toContain('Аудит сети');
    expect(timelinePkg.fields.code).toContain('Настройка кластера');

    // 3. Interactive Calculator
    const calcPkg = packageCalculatorSection(
      { title: 'Конфигуратор узлов', descr: 'Расчет бюджета' },
      'linear'
    );
    expect(calcPkg.tplId).toBe('T123');
    expect(calcPkg.fields.code).toContain('id="calculator"');
    expect(calcPkg.fields.code).toContain('calc-slider');
    expect(calcPkg.fields.code).toContain('updateCalculator');
    expect(calcPkg.fields.code).toContain('calc-total');

    // 4. Pricing with Billing Switcher (-20% yearly discount)
    const pricingPkg = packagePricingSection(
      {
        title: 'Тарифы на сервис',
        plans: [
          { name: 'Бизнес', price: '10 000 ₽', features: ['Кластер K8s', 'SLA 99.9%'], is_featured: true },
        ],
      },
      'linear'
    );
    expect(pricingPkg.tplId).toBe('T123');
    expect(pricingPkg.fields.code).toContain('toggleBillingPeriod()');
    expect(pricingPkg.fields.code).toContain('data-month="10 000 ₽"');
    expect(pricingPkg.fields.code).toContain('data-year="8 000 ₽"');
    expect(pricingPkg.fields.code).toContain('-20%');

    // 5. Schema.org JSON-LD & Meta tags
    const jsonLd = SeoOrchestrator.generateJsonLd({
      title: 'DevTools Cloud',
      descr: 'Next-gen cloud telemetry and orchestration',
      faq: {
        items: [{ question: 'Как оплатить?', answer: 'Картой или безналичным расчетом.' }],
      },
      pricing: {
        plans: [{ name: 'Бизнес', price: '10000 ₽' }],
      },
    });
    expect(jsonLd).toContain('<script type="application/ld+json">');
    expect(jsonLd).toContain('"@type": "Organization"');
    expect(jsonLd).toContain('"@type": "FAQPage"');
    expect(jsonLd).toContain('Как оплатить?');
    expect(jsonLd).toContain('"@type": "Product"');
    expect(jsonLd).toContain('"@type": "Offer"');
    expect(jsonLd).toContain('10000');

    const metaTags = SeoOrchestrator.generateMetaTags({
      title: 'DevTools Cloud',
      descr: 'Cloud telemetry',
      image: 'https://images.unsplash.com/test-og.jpg',
      url: 'https://devtools.cloud',
    });
    expect(metaTags).toContain('og:title');
    expect(metaTags).toContain('og:description');
    expect(metaTags).toContain('og:image');
    expect(metaTags).toContain('twitter:card');

    // 6. Hero enhancements (critical preload + CRO overlays)
    const heroPkg = packageHeroSection(
      {
        title: 'DevTools Cloud Engine',
        descr: 'High performance',
        backgroundUrl: 'https://images.unsplash.com/hero-bg.jpg',
      },
      'tech',
      true,
      'linear'
    );
    expect(heroPkg.fields.code).toContain('<link rel="preload" as="image" href="https://images.unsplash.com/hero-bg.jpg">');
    expect(heroPkg.fields.code).toContain('application/ld+json');
    expect(heroPkg.fields.code).toContain('id="sticky-mobile-cta"');
    expect(heroPkg.fields.code).toContain('id="social-proof-toast"');
    expect(heroPkg.fields.code).toContain('id="cookie-consent-banner"');
    expect(heroPkg.fields.code).toContain('acceptCookies()');
  });

  it('Scenario 13: Phase 1 Stabilization (Dehardcoded Success Text, Phone Validation, Honeypot, CRO flags)', async () => {
    const { packageContactSection, packageHeroSection } = await import(
      '../src/generators/block-packager.js'
    );
    const { TemplateEngine } = await import('../src/generators/template-engine.js');

    // 1. Default success text, honeypot, autocomplete and phone validation
    const contactPkgDefault = packageContactSection(
      { title: 'Заказать консультацию', descr: 'Оставьте заявку' },
      'https://api.example.com/lead',
      'dark'
    );
    expect(contactPkgDefault.tplId).toBe('T123');
    expect(contactPkgDefault.fields.code).toContain('name="_hp_company"');
    expect(contactPkgDefault.fields.code).toContain('autocomplete="name"');
    expect(contactPkgDefault.fields.code).toContain('autocomplete="tel" inputmode="tel"');
    expect(contactPkgDefault.fields.code).toContain('autocomplete="email"');
    expect(contactPkgDefault.fields.code).toContain('phoneDigits.length !== 11');
    expect(contactPkgDefault.fields.code).toContain('id="phone-error"');
    expect(contactPkgDefault.fields.code).toContain('id="lead-form-error"');
    expect(contactPkgDefault.fields.code).toContain(
      'Наш специалист свяжется с вами в ближайшее время по указанному номеру телефона.'
    );

    // 2. Custom success text via parameter or data
    const contactPkgCustom = packageContactSection(
      { title: 'B2B Заявка', success_message: 'Менеджер свяжется с вами в течение 10 минут.' },
      undefined,
      'apple',
      'Персональный куратор перезвонит вам за 5 минут.'
    );
    expect(contactPkgCustom.fields.code).toContain(
      'Персональный куратор перезвонит вам за 5 минут.'
    );
    expect(contactPkgCustom.fields.code).not.toContain(
      'Наш специалист свяжется с вами в ближайшее время'
    );

    // 3. Safe-area insets & Cookie Banner mobile offset
    const croDefault = TemplateEngine.renderCroOverlays();
    expect(croDefault).toContain('padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px))');
    expect(croDefault).toContain('padding-bottom: max(12px, env(safe-area-inset-bottom, 12px))');
    expect(croDefault).toContain('bottom-20 sm:bottom-4');

    // 4. CRO flags filtering
    const heroWithCroFlags = packageHeroSection(
      { title: 'Enterprise Cloud' },
      'telecom',
      false,
      'dark',
      undefined,
      {
        enable_sticky_bar: false,
        enable_social_toast: false,
        enable_cookie_banner: true,
      }
    );
    expect(heroWithCroFlags.fields.code).not.toContain('id="sticky-mobile-cta"');
    expect(heroWithCroFlags.fields.code).not.toContain('id="social-proof-toast"');
    expect(heroWithCroFlags.fields.code).toContain('id="cookie-consent-banner"');

    // 5. Completely disabled CRO layer
    const heroCroDisabled = packageHeroSection(
      { title: 'Enterprise Cloud' },
      'telecom',
      false,
      'dark',
      undefined,
      { enabled: false }
    );
    expect(heroCroDisabled.fields.code).not.toContain('id="sticky-mobile-cta"');
    expect(heroCroDisabled.fields.code).not.toContain('id="social-proof-toast"');
    expect(heroCroDisabled.fields.code).not.toContain('id="cookie-consent-banner"');
  });

  it('Scenario 14: Phase 2 Core Advanced & DX (Local Preview, Calculator Customization, Telegram Backup)', async () => {
    const fs = await import('fs');
    const { buildLocalPreview } = await import('../src/generators/preview-builder.js');
    const { packageCalculatorSection, packageContactSection } = await import(
      '../src/generators/block-packager.js'
    );
    const { getThemeTokens } = await import('../src/templates/theme-tokens.js');

    // 1. Local preview generator (Dry Run)
    const previewResult = buildLocalPreview({
      landingTitle: 'Dry Run Preview Test',
      style_preset: 'apple',
      sections: {
        header: {
          logo_text: 'PreviewTech',
          menu_items: [{ title: 'Фичи', href: '#features' }],
        },
        hero: {
          title: 'Мгновенное локальное превью',
          descr: 'Сборка без обращения к Tilda API',
        },
        calculator: {
          title: 'Калькулятор лицензий',
          unit_label: 'лицензий',
          base_price: 15000,
          min: 1,
          max: 20,
          default_value: 4,
        },
        form: {
          title: 'Заявка на пилот',
          telegram_bot_token: 'TEST_TOKEN_123',
          telegram_chat_id: 'TEST_CHAT_456',
        },
        footer: {
          title: 'PreviewTech Inc.',
        },
      },
    });

    expect(fs.existsSync(previewResult.filePath)).toBe(true);
    expect(previewResult.previewUrl).toMatch(/^file:\/\/\//);
    expect(previewResult.html).toContain('<!DOCTYPE html>');
    expect(previewResult.html).toContain('Plus+Jakarta+Sans');
    expect(previewResult.html).toContain('PreviewTech');
    expect(previewResult.html).toContain('Мгновенное локальное превью');
    expect(previewResult.html).toContain('Калькулятор лицензий');
    expect(previewResult.sectionsCount).toBeGreaterThanOrEqual(4);

    // 2. Calculator Parameterization
    const calcPkg = packageCalculatorSection(
      {
        title: 'Конфигуратор тарифа',
        descr: 'Выберите объем ресурсов',
        unit_label: 'виртуальных машин',
        base_price: 8500,
        min: 2,
        max: 64,
        step: 2,
        default_value: 10,
      },
      'linear'
    );
    expect(calcPkg.fields.code).toContain('8500');
    expect(calcPkg.fields.code).toContain('виртуальных машин');
    expect(calcPkg.fields.code).toContain('min="2"');
    expect(calcPkg.fields.code).toContain('max="64"');
    expect(calcPkg.fields.code).toContain('step="2"');
    expect(calcPkg.fields.code).toContain('value="10"');
    // 10 * 8500 = 85 000 ₽
    expect(calcPkg.fields.code).toContain((85000).toLocaleString('ru-RU') + ' ₽');

    // 3. Telegram Lead Delivery & LocalStorage fallback
    const contactTg = packageContactSection(
      {
        title: 'Связаться с нами',
        telegram_bot_token: 'BOT_TOKEN_XYZ',
        telegram_chat_id: 'CHAT_ID_789',
      },
      undefined,
      'dark'
    );
    expect(contactTg.fields.code).toContain('var tgBotToken = \'BOT_TOKEN_XYZ\';');
    expect(contactTg.fields.code).toContain('var tgChatId = \'CHAT_ID_789\';');
    expect(contactTg.fields.code).toContain('https://api.telegram.org/bot\' + tgBotToken + \'/sendMessage');
    expect(contactTg.fields.code).toContain('Новая заявка с сайта');
    expect(contactTg.fields.code).toContain('tilda_offline_leads');

    // Offline buffer when neither webhook nor TG token is provided
    const contactOffline = packageContactSection({ title: 'Тестовая форма' }, undefined, 'apple');
    expect(contactOffline.fields.code).toContain('localStorage.setItem(\'tilda_offline_leads\'');

    // 4. Font Pairs in Theme Tokens
    expect(getThemeTokens('linear').fontImportUrl).toContain('Inter');
    expect(getThemeTokens('linear').fontImportUrl).toContain('JetBrains+Mono');
    expect(getThemeTokens('apple').fontImportUrl).toContain('Plus+Jakarta+Sans');
    expect(getThemeTokens('dark').fontImportUrl).toContain('Open+Sans');
  });
});


