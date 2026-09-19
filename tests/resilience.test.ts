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

    // Must not throw, returns false safely
    const deleted = await client.deletePage('99998888');
    expect(deleted).toBe(false);
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
});
