import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TildaHttpClient, sanitizeString, sanitizeFields } from '../src/driver/tilda-http-client.js';

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
    const { BLOCK_TEMPLATES } = await import('../src/driver/tilda-http-client.js');
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

    // Buttons: 1408px pill, Sky CTA #0070D5, 500 weight, 36-40px height
    expect(djiCss).toContain('border-radius: 1408px !important');
    expect(djiCss).toContain('background-color: #0070D5 !important');
    expect(djiCss).toContain('font-weight: 500 !important');
    expect(djiCss).toContain('min-height: 36px !important');

    // Cards: 4px flat border-radius, #EDEDED background, box-shadow: none
    expect(djiCss).toContain('background-color: #EDEDED !important');
    expect(djiCss).toContain('border-radius: 4px !important');
    expect(djiCss).toContain('box-shadow: none !important');
    expect(djiCss).toContain('border-color: #3B63A9 !important');

    // Badges and list markers
    expect(djiCss).toContain('color: #3B63A9 !important');
    expect(djiCss).toContain('\\2014\\00a0');
  });
});

