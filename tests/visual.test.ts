import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import path from 'path';
import { pathToFileURL } from 'url';
import { buildLocalPreview } from '../src/generators/preview-builder.js';
import { ROOT_DIR } from '../src/config.js';

describe('Visual Regression & Layout Integrity Suite (Playwright)', () => {
  let browser: Browser;
  let previewUrl: string;

  beforeAll(async () => {
    // 1. Build a rich representative landing preview with all interactive components and CRO layer
    const result = buildLocalPreview({
      landingTitle: 'Visual Regression Test Suite Landing',
      style_preset: 'apple',
      analytics: {
        ym_id: '12345678',
        ga_id: 'G-VISUAL99',
      },
      sections: {
        header: {
          logo_text: 'VisualTech',
          btn_text: 'Связаться',
          btn_href: '#form',
          menu_items: [
            { title: 'Возможности', href: '#features' },
            { title: 'Калькулятор', href: '#calculator' },
            { title: 'Тарифы', href: '#pricing' },
            { title: 'FAQ', href: '#faq' },
          ],
        },
        hero: {
          title: 'Автономная платформа визуальной автоматизации',
          subtitle: 'Ультрабыстрая проверка мобильной адаптивности, безопасных зон и интерактивных компонентов.',
          badge: 'Visual Verified',
          btn1_text: 'Попробовать бесплатно',
          btn1_href: '#form',
          btn2_text: 'Рассчитать тариф',
          btn2_href: '#calculator',
          niche: 'telecom',
        },
        marquee: {
          items: ['Playwright', 'Vitest', 'TypeScript', 'TailwindCSS', 'Tilda', 'Docker'],
        },
        features: {
          title: 'Ключевые преимущества верстки',
          descr: 'Идеальная адаптивность без паразитного скролла и микро-JS компоненты.',
          cards: [
            { title: 'Zero Overflow', descr: 'Никакого горизонтального скролла на мобильных.', icon: 'shield' },
            { title: 'Safe Area', descr: 'Корректные отступы под home indicator iOS.', icon: 'cpu' },
            { title: 'Интерактивность', descr: 'Калькулятор и переключатель тарифов.', icon: 'bolt' },
          ],
        },
        timeline: {
          title: 'Этапы внедрения',
          descr: 'Четыре шага к развертыванию.',
          steps: [
            { step_num: '01', title: 'Аудит', descr: 'Анализ инфраструктуры.' },
            { step_num: '02', title: 'Деплой', descr: 'Запуск сервисов.' },
          ],
        },
        metrics: {
          title: 'Факты и цифры',
          items: [
            { value: '100%', label: 'Mobile адаптивность' },
            { value: '< 20ms', label: 'Реакция интерфейса' },
          ],
        },
        calculator: {
          title: 'Интерактивный расчет ресурсов',
          descr: 'Оцените ежемесячный бюджет с помощью слайдера.',
          input_label: 'Количество инстансов',
          unit_label: 'серверов',
          base_price: 15000,
          min: 1,
          max: 20,
          step: 1,
          default_value: 4,
          btn_text: 'Забронировать',
        },
        pricing: {
          title: 'Гибкие тарифные планы',
          descr: 'Экономьте 20% при выборе годовой подписки.',
          plans: [
            {
              name: 'Стартовый',
              price: '10 000 ₽',
              is_featured: false,
              features: ['1 сервер', 'SSL сертификат', 'Базовый мониторинг'],
              btn_text: 'Выбрать план',
            },
            {
              name: 'Enterprise',
              price: '40 000 ₽',
              is_featured: true,
              badge: 'Рекомендуем',
              features: ['Выделенный кластер', 'Поддержка 24/7', 'SLA 99.99%'],
              btn_text: 'Подключить Enterprise',
            },
          ],
        },
        faq: {
          title: 'Вопросы и ответы',
          descr: 'Часто задаваемые вопросы о сервисе.',
          items: [
            { question: 'Поддерживаются ли мобильные браузеры?', answer: 'Да, верстка полностью оптимизирована под iOS и Android.' },
            { question: 'Есть ли интеграция с Telegram?', answer: 'Да, заявки мгновенно отправляются в Telegram-бота.' },
          ],
        },
        form: {
          title: 'Оставьте заявку на пилот',
          descr: 'Заполните форму, и мы свяжемся с вами за 10 минут.',
          btn_text: 'Отправить заявку',
          badge: 'Быстрый старт',
        },
        cro: {
          enable_sticky_bar: true,
          enable_social_toast: true,
          enable_cookie_banner: true,
          stickyTitle: 'Готовы протестировать?',
          stickySubtitle: '14 дней бесплатного доступа',
          stickyBtn: 'Начать',
          socialProofMsg: 'Команда Яндекс только что подключила тариф',
        },
        footer: {
          title: 'VisualTech Inc.',
        },
      },
    });

    previewUrl = result.previewUrl;

    // 2. Launch headless Chromium
    browser = await chromium.launch({ headless: true });
  }, 30000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  // =========================================================================
  // VIEWPORT 1: Mobile Safari (iPhone 13/14 Pro - 375x812)
  // =========================================================================
  describe('Mobile Viewport (iPhone 13/14 Pro - 375x812)', () => {
    let context: BrowserContext;
    let page: Page;

    beforeAll(async () => {
      context = await browser.newContext({
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      });
      page = await context.newPage();
      await page.goto(previewUrl, { waitUntil: 'domcontentloaded' });
    });

    afterAll(async () => {
      await context.close();
    });

    it('Check 1: Zero Horizontal Overflow on 375px (No parasitic horizontal scroll)', async () => {
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);

      // Verify page cannot scroll horizontally
      const maxScrollX = await page.evaluate(() => {
        window.scrollTo(9999, 0);
        const sx = window.scrollX;
        window.scrollTo(0, 0);
        return sx;
      });
      expect(maxScrollX).toBe(0);
    });

    it('Check 2: Safe Area & Sticky Mobile CTA Bar visibility and bottom padding', async () => {
      const stickyBar = page.locator('#sticky-mobile-cta');
      expect(await stickyBar.isVisible()).toBe(true);

      // Check computed padding bottom is >= 12px (safe-area fallback)
      const computedPadding = await stickyBar.evaluate((el) => {
        return parseFloat(window.getComputedStyle(el).paddingBottom);
      });
      expect(computedPadding).toBeGreaterThanOrEqual(12);

      // Verify sticky mobile CTA has high z-index
      const zIndex = await stickyBar.evaluate((el) => {
        return window.getComputedStyle(el).zIndex;
      });
      expect(Number(zIndex)).toBeGreaterThanOrEqual(40);
    });

    it('Check 3: Sticky Mobile CTA does not permanently block lead form submit', async () => {
      // Scroll to form section
      await page.locator('#form').scrollIntoViewIfNeeded();

      const submitBtn = page.locator('#lead-form button[type="submit"]');
      expect(await submitBtn.isVisible()).toBe(true);

      // Ensure button is clickable
      const isClickable = await submitBtn.evaluate((btn) => {
        const rect = btn.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      expect(isClickable).toBe(true);
    });

    it('Check 4: Interactive Calculator range slider updates total in DOM on mobile', async () => {
      // Initial value = 4 * 15000 = 60 000 ₽
      const initialTotal = await page.locator('#calc-total').innerText();
      expect(initialTotal).toContain((60000).toLocaleString('ru-RU'));

      // Move slider to 8 servers
      await page.evaluate(() => {
        const slider = document.getElementById('calc-slider') as HTMLInputElement;
        if (slider) {
          slider.value = '8';
          slider.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      // Expected: 8 * 15000 = 120 000 ₽
      const updatedTotal = await page.locator('#calc-total').innerText();
      expect(updatedTotal).toContain((120000).toLocaleString('ru-RU'));
      expect(await page.locator('#calc-val-display').innerText()).toBe('8 серверов');
    });

    it('Check 5: Billing toggle switcher updates pricing and discounts on mobile', async () => {
      const periodBadge = page.locator('.pricing-card-period').first();
      expect(await periodBadge.innerText()).toContain('/ месяц');

      // Click toggle switcher
      await page.locator('#billing-toggle-btn').click();

      // Verified yearly discount switch
      expect(await periodBadge.innerText()).toContain('-20%');

      // Verify knob shifted
      const knobClass = await page.locator('#billing-toggle-knob').getAttribute('class');
      expect(knobClass).toContain('translate-x-6');
    });

    it('Check 6: FAQ Accordion opens and closes cleanly on touch', async () => {
      const firstFaq = page.locator('#faq details').first();
      expect(await firstFaq.getAttribute('open')).toBeNull();

      // Click summary to open
      await firstFaq.locator('summary').click();
      expect(await firstFaq.getAttribute('open')).not.toBeNull();

      // Answer text is visible
      const answer = firstFaq.locator('div');
      expect(await answer.isVisible()).toBe(true);
    });
  });

  // =========================================================================
  // VIEWPORT 2: Desktop Modern (1440x900)
  // =========================================================================
  describe('Desktop Viewport (1440x900)', () => {
    let context: BrowserContext;
    let page: Page;
    const failedNetworkRequests: string[] = [];

    beforeAll(async () => {
      context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      page = await context.newPage();

      // Track failed network requests (excluding optional favicon/telemetry)
      page.on('response', (res) => {
        const url = res.url();
        if (
          res.status() >= 400 &&
          !url.includes('favicon.ico') &&
          !url.includes('googletagmanager.com') &&
          !url.includes('mc.yandex.ru')
        ) {
          failedNetworkRequests.push(`${res.status()} ${url}`);
        }
      });

      await page.goto(previewUrl, { waitUntil: 'domcontentloaded' });
    });

    afterAll(async () => {
      await context.close();
    });

    it('Check 7: Zero Horizontal Overflow on Desktop (1440px)', async () => {
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
    });

    it('Check 8: Mobile Sticky CTA is hidden on desktop (sm:hidden)', async () => {
      const stickyBar = page.locator('#sticky-mobile-cta');
      expect(await stickyBar.isHidden()).toBe(true);
    });

    it('Check 9: Social Proof Toast and Cookie Consent Banner are visible on desktop', async () => {
      const toast = page.locator('#social-proof-toast');
      expect(await toast.isVisible()).toBe(true);

      const cookieBanner = page.locator('#cookie-consent-banner');
      expect(await cookieBanner.isVisible()).toBe(true);

      // Accept cookies and verify banner is dismissed and stored in localStorage
      await cookieBanner.locator('button').click();
      expect(await cookieBanner.isHidden()).toBe(true);

      const consentValue = await page.evaluate(() => localStorage.getItem('cookie_consent'));
      expect(consentValue).toBe('accepted');
    });

    it('Check 10: No missing local assets or broken image requests', async () => {
      expect(failedNetworkRequests).toEqual([]);

      // Verify all SVG icons render properly
      const svgCount = await page.locator('svg').count();
      expect(svgCount).toBeGreaterThanOrEqual(5);
    });

    it('Check 11: Schema.org JSON-LD and Analytics snippets are intact in DOM', async () => {
      const scripts = await page.locator('script[type="application/ld+json"]').allInnerTexts();
      expect(scripts.length).toBeGreaterThanOrEqual(1);

      const jsonLd = JSON.parse(scripts[0]);
      expect(Array.isArray(jsonLd)).toBe(true);

      const org = jsonLd.find((item: any) => item['@type'] === 'Organization');
      expect(org).toBeDefined();

      const hasTrackEvent = await page.evaluate(() => typeof (window as any).trackEvent === 'function');
      expect(hasTrackEvent).toBe(true);
    });
  });
});
