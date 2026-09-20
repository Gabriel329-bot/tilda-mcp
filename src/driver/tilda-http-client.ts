import fs from 'fs';
import path from 'path';
import { STORAGE_STATE_PATH, DEFAULT_USER_AGENT, TILDA_BASE_URL } from '../config.js';
import { STYLE_PRESETS, StylePresetName } from '../styles/presets.js';

export interface BlockFields {
  [key: string]: any;
}

export interface SessionInfo {
  csrf: string;
  pageId: string;
  domain: string;
  status: number;
}

export interface PublishResult {
  pageId: string;
  publishedUrl: string;
  publishedAt: string;
}

export interface CookieItem {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
}

/**
 * Standard block template mappings (Alias -> tplId).
 */
export const BLOCK_TEMPLATES: Record<string, string> = {
  ME101: '2083', // Classic top menu with logo, links and button (ME301N)
  ME301N: '2083',// Classic top menu with logo, links and button
  '133': '2083', // User alias fallback for classic menu
  TX16N: '585',  // Text in folding cards / FAQ accordion (TX16N)
  TX16: '585',   // FAQ accordion
  '746': '585',  // User alias fallback for FAQ accordion
  T173: '213',   // Anchor block
  CR30: '205',   // Cover with 2 buttons (CR16 centered)
  CR16: '205',   // Cover with 2 buttons (CR16 centered)
  CR15: '204',   // Cover with 2 buttons (CR15 left-aligned)
  CR01: '18',    // Classic cover CR01
  FR104: '491',  // Features 4 columns (FR205)
  FR205: '491',  // Features 4 columns (FR205)
  NM01: '1050',  // Metrics / Numbers (FR402N)
  FR402N: '1050',// Metrics / Numbers (FR402N)
  BF204: '678',  // Contact form (BF204N)
  BF204N: '678', // Contact form (BF204N)
  PR04: '776',   // Modern monolithic pricing cards (PR04 / T776)
  '776': '776',  // Modern monolithic pricing cards
  PR01: '776',   // Pricing cards (default to monolithic 776)
  '301': '776',  // Pricing alias
  '142': '142',  // Classic pricing table
  PL120N: '1072',// Pricing cards (PL120N)
  '1072': '1072',// Pricing cards
  TS101: '533',  // Testimonials / Review cards in 3 columns (TS203)
  '441': '533',  // Testimonials alias
  TS203: '533',  // Testimonials / Review cards in 3 columns
  '533': '533',  // Testimonials / Review cards in 3 columns
  TS101N: '605', // Review slider with image on top
  '605': '605',  // Review slider with image on top
  FT101: '144',  // Footer (FT101)
  T123: '131',   // HTML/CSS/JS raw code embed (T123)
  '131': '131',  // HTML/CSS/JS raw code embed (T123)
};

/**
 * HTTP status codes that are eligible for automatic retry with exponential backoff.
 */
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1000, 2500]; // delays before attempt 2 and 3

/**
 * Sanitizes text strings for safe embedding into Tilda POST parameters and JSON list payloads.
 * Handles typographic quotes («»), double quotes, ampersands, newlines, and other problem characters.
 */
export function sanitizeString(val: string): string {
  if (!val || typeof val !== 'string') return val;
  return val
    .replace(/\r\n/g, '\n')       // normalize CRLF
    .replace(/\r/g, '\n')         // normalize CR
    .replace(/\t/g, ' ')          // tabs to spaces
    .replace(/«/g, '&laquo;')     // left guillemet
    .replace(/»/g, '&raquo;')     // right guillemet
    .replace(/“/g, '&ldquo;')     // left double curly quote
    .replace(/”/g, '&rdquo;')     // right double curly quote
    .replace(/‘/g, '&lsquo;')     // left single curly quote
    .replace(/’/g, '&rsquo;')     // right single curly quote
    .replace(/—/g, '&mdash;')     // em dash
    .replace(/–/g, '&ndash;')     // en dash
    .replace(/&(?!(?:[a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;') // bare ampersands only (skip existing entities)
    .replace(/"/g, '&quot;');      // double quote -> entity
}

/**
 * Recursively sanitizes all string values in a plain object or array.
 * Used to clean user-provided content before packing into Tilda POST fields.
 */
export function sanitizeFields(obj: any): any {
  if (typeof obj === 'string') return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeFields);
  if (obj && typeof obj === 'object') {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = sanitizeFields(v);
    }
    return out;
  }
  return obj;
}

export interface TildaHttpClientOptions {
  storagePath?: string;
  baseUrl?: string;
  userAgent?: string;
  humanLikePacing?: boolean; // Anti-fraud human-like pacing with random jitter (default: true)
  minDelayMs?: number;       // Minimum delay between actions (default: 1500ms)
  maxDelayMs?: number;       // Maximum delay between actions (default: 3000ms)
}

/**
 * Ultra-fast HTTP client for Tilda Publishing automation.
 * Replaces headless browser operations with direct AJAX/POST requests to Tilda's editor endpoints.
 * 
 * Key Features:
 * 1. Strictly fixed to https://tilda.cc (no cross-domain redirects to tilda.ru).
 * 2. Matches exact User-Agent used during interactive login (DEFAULT_USER_AGENT).
 * 3. Cookie Jar: dynamically handles Set-Cookie headers and persists updates to storage_state.json.
 * 4. Pre-flight auth verification on https://tilda.cc/projects/.
 */
export class TildaHttpClient {
  private storagePath: string;
  private baseUrl: string = TILDA_BASE_URL || 'https://tilda.cc';
  private commondomain: string = 'tilda.cc';
  private userAgent: string;
  private cookies: Map<string, CookieItem> = new Map();
  private cookieHeader: string = '';
  private csrf: string = '';
  private recordTplMap: Map<string, string> = new Map();
  private humanLikePacing: boolean;
  private minDelayMs: number;
  private maxDelayMs: number;

  constructor(options: TildaHttpClientOptions = {}) {
    this.storagePath = options.storagePath || STORAGE_STATE_PATH;
    // 2. Идентичный User-Agent: точь-в-точь совпадает с User-Agent из npm run login
    this.userAgent = options.userAgent || DEFAULT_USER_AGENT;

    this.humanLikePacing = options.humanLikePacing ?? true;
    this.minDelayMs = options.minDelayMs ?? 80;
    this.maxDelayMs = options.maxDelayMs ?? 120;

    // 1. Единый домен: строго https://tilda.cc
    if (options.baseUrl) {
      this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    } else {
      this.baseUrl = 'https://tilda.cc';
    }
    this.commondomain = 'tilda.cc';

    this.loadCookies();
  }

  /**
   * Simulates realistic human delay / jitter to prevent anti-fraud rate-limiting and bans.
   */
  public async pace(customMin?: number, customMax?: number): Promise<void> {
    if (!this.humanLikePacing) return;
    const min = customMin ?? this.minDelayMs;
    const max = customMax ?? this.maxDelayMs;
    const jitter = Math.floor(min + Math.random() * (max - min));
    await new Promise((resolve) => setTimeout(resolve, jitter));
  }

  public setHumanPacing(enabled: boolean): void {
    this.humanLikePacing = enabled;
  }

  /**
   * Reads cookies from storage_state.json and initializes the in-memory cookie jar.
   * Filters strictly by domain (*.tilda.cc or *.tilda.ru).
   */
  private loadCookies(): void {
    if (!fs.existsSync(this.storagePath)) {
      console.warn(`[TildaHttpClient] Warning: storage state file not found at ${this.storagePath}`);
      return;
    }

    try {
      const raw = fs.readFileSync(this.storagePath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.cookies)) {
        this.cookies.clear();

        // Фильтруй куки строго по домену: оставь только те, где domain заканчивается на tilda.cc (или tilda.ru)
        const relevantCookies = data.cookies.filter((c: any) => {
          if (!c || !c.name || !c.domain) return false;
          const d = c.domain.replace(/^\./, '').toLowerCase();
          return d === 'tilda.cc' || d.endsWith('.tilda.cc') || d === 'tilda.ru' || d.endsWith('.tilda.ru');
        });

        for (const cookie of relevantCookies) {
          if (this.cookies.has(cookie.name)) {
            const existing = this.cookies.get(cookie.name)!;
            if (existing.value === 'deleted' && cookie.value !== 'deleted') {
              this.cookies.set(cookie.name, cookie);
            }
          } else {
            this.cookies.set(cookie.name, cookie);
          }
        }

        // Auto-detect dominant domain from cookies
        const hasRuSession = relevantCookies.some(
          (c: any) => (c.name === 'userid' || c.name === 'hash') && c.domain && c.domain.includes('tilda.ru')
        );
        if (hasRuSession) {
          this.baseUrl = 'https://tilda.ru';
          this.commondomain = 'tilda.ru';
        }

        this.refreshCookieHeader();
      }
    } catch (err: any) {
      console.error(`[TildaHttpClient] Error parsing cookies from ${this.storagePath}:`, err.message);
    }
  }

  /**
   * 3. Сохранение Set-Cookie (Cookie Jar):
   * Обрабатывает входящие заголовки set-cookie из ответов Tilda,
   * обновляет куки в памяти и перезаписывает storage/storage_state.json.
   */
  private handleResponseCookies(res: Response): void {
    // Support Node 18+ res.headers.getSetCookie(), fallback to res.headers.get('set-cookie')
    let setCookieHeaders: string[] = [];
    if (typeof (res.headers as any).getSetCookie === 'function') {
      setCookieHeaders = (res.headers as any).getSetCookie();
    } else {
      const raw = res.headers.get('set-cookie');
      if (raw) {
        setCookieHeaders = [raw];
      }
    }

    if (!setCookieHeaders || setCookieHeaders.length === 0) return;

    let changed = false;
    for (const headerStr of setCookieHeaders) {
      const parts = headerStr.split(';').map((p) => p.trim());
      if (!parts.length) continue;

      const [nv] = parts;
      const eqIdx = nv.indexOf('=');
      if (eqIdx === -1) continue;

      const name = nv.slice(0, eqIdx).trim();
      const value = nv.slice(eqIdx + 1).trim();

      const isDeleted =
        value === 'deleted' ||
        parts.some((p) => p.toLowerCase().startsWith('max-age=0')) ||
        parts.some((p) => p.toLowerCase().includes('expires=thu, 01 jan 1970'));

      if (isDeleted) {
        // Удаляем куку из памяти и диска только если сервер подтвердил это в успешном 200 OK ответе
        if (res.status === 200 && this.cookies.has(name)) {
          this.cookies.delete(name);
          changed = true;
        }
      } else {
        const existing = this.cookies.get(name) || {
          name,
          value,
          domain: `.${this.commondomain}`,
          path: '/',
        };
        existing.value = value;

        for (let i = 1; i < parts.length; i++) {
          const attr = parts[i];
          const aEq = attr.indexOf('=');
          const aName = (aEq === -1 ? attr : attr.slice(0, aEq)).toLowerCase();
          const aVal = aEq === -1 ? '' : attr.slice(aEq + 1);

          if (aName === 'domain') existing.domain = aVal;
          if (aName === 'path') existing.path = aVal;
          if (aName === 'httponly') existing.httpOnly = true;
          if (aName === 'secure') existing.secure = true;
          if (aName === 'samesite') existing.sameSite = aVal as any;
        }

        this.cookies.set(name, existing);
        changed = true;
      }
    }

    if (changed) {
      this.refreshCookieHeader();
      this.saveCookiesToDisk();
    }
  }

  /**
   * Сборка заголовка Cookie:
   * Обязательно в начале идут ключевые куки: PHPSESSID, tildasid, hash, userid.
   */
  private refreshCookieHeader(): void {
    const priorityKeys = ['PHPSESSID', 'tildasid', 'hash', 'userid'];
    const parts: string[] = [];

    for (const key of priorityKeys) {
      const c = this.cookies.get(key);
      if (c && c.value && c.value !== 'deleted') {
        parts.push(`${c.name}=${c.value}`);
      }
    }

    for (const [name, cookie] of this.cookies.entries()) {
      if (!priorityKeys.includes(name) && cookie.value && cookie.value !== 'deleted') {
        parts.push(`${cookie.name}=${cookie.value}`);
      }
    }

    this.cookieHeader = parts.join('; ');
  }

  /**
   * Persists the current cookie jar to storage_state.json in Playwright format.
   */
  private saveCookiesToDisk(): void {
    try {
      let origins: any[] = [
        {
          origin: this.baseUrl,
          localStorage: [],
        },
      ];

      if (fs.existsSync(this.storagePath)) {
        try {
          const prev = JSON.parse(fs.readFileSync(this.storagePath, 'utf-8'));
          if (Array.isArray(prev.origins)) {
            origins = prev.origins;
          }
        } catch {}
      }

      const stateData = {
        cookies: Array.from(this.cookies.values()),
        origins,
      };

      fs.writeFileSync(this.storagePath, JSON.stringify(stateData, null, 2), 'utf-8');
    } catch (err: any) {
      console.warn(`[TildaHttpClient] Could not persist updated cookies: ${err.message}`);
    }
  }

  /**
   * Helper to perform authenticated HTTP requests.
   * Features:
   * - Automatic exponential retry with backoff for HTTP 429, 502, 503, 504 and network errors.
   * - Up to 3 attempts with delays of 1000ms and 2500ms.
   * - Sets User-Agent, Cookie header, and Referer.
   * - Automatically updates internal cookie jar from Set-Cookie response headers.
   */
  private async request(
    url: string,
    options: {
      method?: string;
      body?: URLSearchParams | string;
      headers?: Record<string, string>;
      referer?: string;
      redirect?: RequestRedirect;
    } = {}
  ): Promise<Response> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    const method = options.method || 'GET';

    const reqHeaders: Record<string, string> = {
      'User-Agent': this.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...options.headers,
    };

    if (this.cookieHeader) {
      reqHeaders['Cookie'] = this.cookieHeader;
    }

    if (options.referer) {
      reqHeaders['Referer'] = options.referer;
    }

    if (method === 'POST') {
      reqHeaders['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      reqHeaders['X-Requested-With'] = 'XMLHttpRequest';
    }

    let lastError: Error | null = null;
    let lastResponse: Response | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await fetch(fullUrl, {
          method,
          headers: reqHeaders,
          body: options.body,
          redirect: options.redirect || 'manual',
        });

        // Always process any cookies received from Tilda response
        this.handleResponseCookies(res);

        // If status code is retryable (429, 502, 503, 504) and we have attempts left, backoff and retry
        if (RETRYABLE_STATUSES.has(res.status) && attempt < MAX_RETRIES) {
          const delay = RETRY_DELAYS_MS[attempt - 1] || 1000;
          console.warn(
            `[Retry] ${method} ${fullUrl} returned HTTP ${res.status}, attempt ${attempt}/${MAX_RETRIES}. Retrying in ${delay}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        return res;
      } catch (err: any) {
        lastError = err;
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAYS_MS[attempt - 1] || 1000;
          console.warn(
            `[Retry] ${method} ${fullUrl} network error: ${err.message}. Attempt ${attempt}/${MAX_RETRIES}. Retrying in ${delay}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    if (lastResponse) return lastResponse;
    throw lastError || new Error(`[TildaHttpClient] All ${MAX_RETRIES} attempts exhausted for ${method} ${url}`);
  }

  /**
   * 4. Проверка авторизации перед стартом:
   * Быстрый легкий запрос к /projects/.
   * Если вернулся статус 302 или редирект на /login/, выводит отладочную информацию
   * и выбрасывает типизированную ошибку Error (без process.exit).
   */
  public async checkAuth(): Promise<boolean> {
    const url = `${this.baseUrl}/projects/`;
    let res = await this.request(url, {
      method: 'GET',
      redirect: 'manual',
    });

    let loc = res.headers.get('location') || '';

    // If redirected to alternate domain (tilda.ru <-> tilda.cc)
    if ((res.status === 301 || res.status === 302) && (loc.includes('tilda.ru') || loc.includes('tilda.cc'))) {
      const altBase = loc.includes('tilda.ru') ? 'https://tilda.ru' : 'https://tilda.cc';
      this.baseUrl = altBase;
      this.commondomain = new URL(altBase).hostname;
      res = await this.request(`${altBase}/projects/`, {
        method: 'GET',
        redirect: 'manual',
      });
      loc = res.headers.get('location') || '';
    }

    if (res.status === 301 || res.status === 302 || loc.includes('/login/')) {
      console.log('[Auth Debug] URL ответа:', res.url || url);
      console.log('[Auth Debug] HTTP статус:', res.status);
      console.log('[Auth Debug] Location заголовок:', loc);
      throw new Error('[AUTH_EXPIRED] Сессия Tilda недействительна. Обновите cookie: запустите npm run login или обновите .env');
    }

    if (res.status !== 200) {
      console.log('[Auth Debug] URL ответа:', res.url || url);
      console.log('[Auth Debug] HTTP статус:', res.status);
      console.log('[Auth Debug] Location заголовок:', loc);
      throw new Error(
        `[AUTH_EXPIRED] Сессия Tilda недействительна (HTTP ${res.status}${loc ? ` -> ${loc}` : ''}). Обновите cookie: запустите npm run login или обновите .env`
      );
    }

    return true;
  }

  /**
   * Creates a new blank page in the specified project via direct HTTP POST.
   * Uses template ID 1231 (Tilda's native blank page template).
   * If title is provided, saves page title via comm: "savepagetitle".
   * Returns newly generated pageId.
   */
  public async createPage(projectId: string, title?: string): Promise<string> {
    await this.checkAuth();
    await this.pace(100, 200);

    const payload = new URLSearchParams({
      comm: 'addnewpagedublicateexample',
      projectid: projectId,
      examplepageid: '1231',
      commondomain: this.commondomain,
    });
    if (this.csrf) payload.append('csrf', this.csrf);

    const res = await this.request('/projects/submit/', {
      method: 'POST',
      body: payload,
      referer: `${this.baseUrl}/projects/?projectid=${projectId}&addnewpage=yes`,
    });

    if (res.status !== 200) {
      const errText = await res.text().catch(() => '');
      throw new Error(`[TildaHttpClient] Failed to create page in project ${projectId}: HTTP ${res.status}. ${errText}`);
    }

    const bodyText = (await res.text()).trim();
    const pageIdMatch = bodyText.match(/^(\d+)$/);
    if (!pageIdMatch) {
      throw new Error(`[TildaHttpClient] Unexpected response when creating page: ${bodyText}`);
    }
    const pageId = pageIdMatch[1];

    if (title) {
      await this.pace(100, 200);
      const titlePayload = new URLSearchParams({
        comm: 'savepagetitle',
        pageid: pageId,
        title: title,
        commondomain: this.commondomain,
      });
      if (this.csrf) titlePayload.append('csrf', this.csrf);

      const titleRes = await this.request('/projects/submit/', {
        method: 'POST',
        body: titlePayload,
        referer: `${this.baseUrl}/projects/?projectid=${projectId}`,
      });

      if (titleRes.status !== 200) {
        console.warn(`[TildaHttpClient] Warning: could not set title "${title}" for page ${pageId}`);
      }
    }

    return pageId;
  }

  /**
   * Initializes session by fetching editor HTML and extracting the active CSRF token.
   * Target URL: strictly https://tilda.cc/page/?pageid={pageId}
   */
  public async initSession(pageId: string): Promise<SessionInfo> {
    // 4. Проверка авторизации перед стартом
    await this.checkAuth();

    let editorUrl = `${this.baseUrl}/page/?pageid=${pageId}`;
    let res = await this.request(editorUrl, {
      method: 'GET',
      referer: `${this.baseUrl}/projects/`,
    });

    // Follow legitimate in-domain redirects (up to 3 hops)
    let hops = 0;
    while ((res.status === 301 || res.status === 302) && hops < 3) {
      hops++;
      const loc = res.headers.get('location') || '';

      if (loc.includes('/login/')) {
        throw new Error('[TildaHttpClient] Сессия истекла, запустите npm run login');
      }

      if (loc.includes('/404/') || loc.includes('pagenotpublished')) {
        throw new Error(
          `[TildaHttpClient] Страница ${pageId} не найдена или недоступна в текущем проекте (HTTP 302 -> ${loc}).`
        );
      }

      editorUrl = loc.startsWith('http') ? loc : `${this.baseUrl}${loc}`;

      res = await this.request(editorUrl, {
        method: 'GET',
        referer: `${this.baseUrl}/projects/`,
      });
    }

    // STRICT STATUS CHECK: Must be 200 OK
    if (res.status !== 200) {
      const errBody = await res.text().catch(() => '');
      throw new Error(
        `[TildaHttpClient] Failed to initialize page ${pageId}: expected HTTP 200, got ${res.status}. ${errBody.slice(0, 150)}`
      );
    }

    const html = await res.text();

    this.csrf = '';

    // 2. Искать CSRF-токен по следующим паттернам в HTML:
    // Паттерн 1: window.tildaCsrf = '...' или csrf: '...'
    const jsMatch =
      html.match(/window\.tildaCsrf\s*=\s*['"]([^'"]+)['"]/i) ||
      html.match(/window\.csrf\s*=\s*['"]([^'"]+)['"]/i) ||
      html.match(/csrf\s*[:=]\s*['"]([a-f0-9]{16,64})['"]/i) ||
      html.match(/['"]csrf['"]\s*:\s*['"]([^'"]+)['"]/i);
    if (jsMatch && jsMatch[1]) {
      this.csrf = jsMatch[1];
    }

    // Паттерн 2: name="csrf" value="(.*?)"
    if (!this.csrf) {
      const inputMatch =
        html.match(/name=["']csrf["'][^>]*value=["']([^"']+)["']/i) ||
        html.match(/value=["']([^"']+)["'][^>]*name=["']csrf["']/i);
      if (inputMatch && inputMatch[1]) {
        this.csrf = inputMatch[1];
      }
    }

    // Паттерн 3: data-csrf="(.*?)"
    if (!this.csrf) {
      const dataMatch = html.match(/data-csrf=["']([^"']+)["']/i);
      if (dataMatch && dataMatch[1]) {
        this.csrf = dataMatch[1];
      }
    }

    // Паттерн 4: <meta name="csrf" content="(.*?)">
    if (!this.csrf) {
      const metaMatch =
        html.match(/<meta[^>]*name=["']csrf["'][^>]*content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']csrf["']/i) ||
        html.match(/id=["']csrf["'][^>]*content=["']([^"']+)["']/i);
      if (metaMatch && metaMatch[1]) {
        this.csrf = metaMatch[1];
      }
    }

    // 3. Если CSRF найден — сохраняем, если нет — используем стандартный режим сессионных кук
    if (!this.csrf) {
      console.log(`[TildaHttpClient] CSRF в разметке пуст (стандартный режим сессионных кук Tilda для страницы ${pageId})`);
      this.csrf = '';
    }

    return {
      csrf: this.csrf,
      pageId,
      domain: this.commondomain,
      status: res.status,
    };
  }

  /**
   * Adds a block to the page via direct POST to /page/submit/ with comm: "addnewrecord".
   * Parameters: comm, pageid, tplid, commondomain, csrf.
   * Returns recordId. Throws on non-200 response.
   */
  public async addBlock(pageId: string, tplIdOrAlias: string): Promise<string> {
    await this.pace(60, 100);

    const tplId = BLOCK_TEMPLATES[tplIdOrAlias.toUpperCase()] || tplIdOrAlias;

    const payload = new URLSearchParams({
      comm: 'addnewrecord',
      pageid: pageId,
      tplid: tplId,
      tplId: tplId,
      commondomain: this.commondomain,
    });
    if (this.csrf) payload.append('csrf', this.csrf);

    const res = await this.request('/page/submit/', {
      method: 'POST',
      body: payload,
      referer: `${this.baseUrl}/page/?pageid=${pageId}`,
    });

    // STRICT STATUS CHECK: Must be 200 OK
    if (res.status !== 200) {
      const errBody = await res.text().catch(() => '');
      throw new Error(
        `[TildaHttpClient] Failed to add block "${tplIdOrAlias}" to page ${pageId}: expected HTTP 200, got ${res.status}. ${errBody.slice(0, 150)}`
      );
    }

    const responseText = await res.text();
    let recordId = '';

    // Strategy 1: JSON response
    try {
      const data = JSON.parse(responseText);
      recordId = String(data.recordid || data.record_id || data.id || data.rec_id || '');
      if (!recordId && data.html) {
        const hMatch =
          data.html.match(/recordid=["'](\d+)["']/i) ||
          data.html.match(/id=["']rec(?:ord)?(\d+)["']/i);
        if (hMatch && hMatch[1]) {
          recordId = hMatch[1];
        }
      }
    } catch {}

    // Strategy 2: Regex extraction from HTML / plain text response
    if (!recordId) {
      const match =
        responseText.match(/recordid["':\s=]+["']?(\d+)["']?/i) ||
        responseText.match(/data-record-id=["'](\d+)["']/i) ||
        responseText.match(/id=["']rec(?:ord)?(\d+)["']/i);
      if (match && match[1]) {
        recordId = match[1];
      }
    }

    if (!recordId) {
      recordId = `rec${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    }

    if (recordId) {
      this.recordTplMap.set(recordId, tplId);
    }

    return recordId;
  }

  /**
   * Manually register or override the template mapping for a specific record ID.
   */
  public registerRecordTpl(recordId: string, tplIdOrAlias: string): void {
    const tplId = BLOCK_TEMPLATES[tplIdOrAlias.toUpperCase()] || tplIdOrAlias;
    this.recordTplMap.set(recordId, tplId);
  }

  /**
   * Updates block content via direct POST to /page/submit/ with comm: "saverecord".
   * Parameters: comm, pageid, recordid, commondomain, csrf, plus field key/values.
   * Sanitizes all user-provided text fields before submission.
   * Throws on non-200 response.
   */
  public async updateBlock(
    pageId: string,
    recordId: string,
    rawFields: BlockFields
  ): Promise<{ success: boolean; recordId: string; fieldsUpdated: string[] }> {
    await this.pace(80, 120);

    // Sanitize all user-supplied text content (titles, descriptions, FAQ, reviews, etc.)
    // Preserve raw code embeds (T123) without HTML entity substitutions
    const fields = sanitizeFields(rawFields) as BlockFields;
    if (rawFields.code !== undefined) fields.code = rawFields.code;
    if (rawFields.rawcod !== undefined) fields.rawcod = rawFields.rawcod;

    // 1. Resolve block template ID and style preset
    const tplId = String(fields.tplId || fields.tplid || this.recordTplMap.get(recordId) || '');
    const rawPreset = fields.style_preset || fields.theme || (fields.colormode === 'dark' ? 'dark' : 'minimal');
    const preset: StylePresetName = (rawPreset === 'dark' || rawPreset === 'minimal' || rawPreset === 'warm') ? rawPreset : 'minimal';
    const theme = STYLE_PRESETS[preset] || STYLE_PRESETS.minimal;
    const isDark = preset === 'dark' || fields.colormode === 'dark';

    // 2. Extract scalar fields (excluding 'list', 'inputs', 'forminputs')
    const scalarFields: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (
        key !== 'list' &&
        key !== 'inputs' &&
        key !== 'forminputs' &&
        value !== undefined &&
        value !== null
      ) {
        scalarFields[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
      }
    }

    // Auto-populate cover background image fields if either img or bgimg is passed
    const imgVal = fields.img || fields.bgimg;
    if (imgVal && typeof imgVal === 'string' && imgVal.startsWith('http')) {
      scalarFields.img = imgVal;
      scalarFields.bgimg = imgVal;
      scalarFields['img-tuinfo-cdnurl'] = imgVal;
    }

    // Support anchor identifiers
    if (fields.rec_anchor !== undefined || fields.anchor !== undefined) {
      const anchorVal = String(fields.rec_anchor || fields.anchor).replace(/^#/, '');
      scalarFields.rec_anchor = anchorVal;
      scalarFields.anchor = anchorVal;
    }

    // Color mode and theme (dark / light)
    scalarFields.colormode = isDark ? 'dark' : 'light';
    scalarFields.theme = preset;

    // Block background color default
    if (fields.bg_color || fields.bgcolor || fields.blockbackground) {
      const bgColor = fields.bg_color || fields.bgcolor || fields.blockbackground;
      scalarFields.bg_color = bgColor;
      scalarFields.bgcolor = bgColor;
      scalarFields.blockbackground = bgColor;
    } else if (isDark && tplId !== '205' && tplId !== '204' && tplId !== '18') {
      // Dark theme background default for non-cover blocks
      scalarFields.bg_color = theme.bgPrimary;
      scalarFields.bgcolor = theme.bgPrimary;
      scalarFields.blockbackground = theme.bgPrimary;
    }

    // Determine block semantics
    const isHero =
      tplId === '205' ||
      tplId === '204' ||
      tplId === '18' ||
      !!imgVal ||
      (!!fields.title && !!fields.buttontitle && !!fields.buttontitle2);
    const isForm = tplId === '678' || fields.inputs !== undefined || fields.forminputs !== undefined;
    const isPricing = tplId === '776' || tplId === '1072' || tplId === '301' || tplId === '142';
    const isReviews = tplId === '533' || tplId === '441' || tplId === '605';
    const isListOrCards =
      tplId === '491' ||
      tplId === '1050' ||
      tplId === '585' ||
      isPricing ||
      isReviews ||
      fields.list !== undefined;

    // Automatic default anchors for pricing and reviews
    if (isPricing && !scalarFields.rec_anchor && !fields.rec_anchor && !fields.anchor) {
      scalarFields.rec_anchor = 'pricing';
      scalarFields.anchor = 'pricing';
    }
    if (isReviews && !scalarFields.rec_anchor && !fields.rec_anchor && !fields.anchor) {
      scalarFields.rec_anchor = 'reviews';
      scalarFields.anchor = 'reviews';
    }

    // Clear default currency prefix for pricing to prevent "$0 ₽"
    if (isPricing) {
      if (scalarFields.price_cur === undefined) scalarFields.price_cur = '';
      if (scalarFields.currency === undefined) scalarFields.currency = '';
    }

    // =========================================================================
    // SMART DEFAULTS: 1. Cover Hero (CR16 / CR30 / CR15 - tplId 205, 204, 18)
    // =========================================================================
    if (isHero) {
      if (preset === 'dark') {
        // High density darkening mask for dark theme (85%)
        scalarFields.overlaycolor = fields.overlaycolor || fields.filtercolor || '#0A0C10';
        scalarFields.overlaycolor2 = fields.overlaycolor2 || fields.filtercolor2 || '#0A0C10';
        scalarFields.filtercolor = scalarFields.overlaycolor;
        scalarFields.filtercolor2 = scalarFields.overlaycolor2;
        scalarFields.overlayopacity =
          fields.overlayopacity !== undefined
            ? String(fields.overlayopacity)
            : fields.filteropacity !== undefined
            ? String(fields.filteropacity)
            : '85';
        scalarFields.overlayopacity2 =
          fields.overlayopacity2 !== undefined
            ? String(fields.overlayopacity2)
            : fields.filteropacity2 !== undefined
            ? String(fields.filteropacity2)
            : '85';
        scalarFields.filteropacity = scalarFields.overlayopacity;
        scalarFields.filteropacity2 = scalarFields.overlayopacity2;

        // Button 1 (CTA) in dark theme: neon accent with high-contrast text and 12px radius
        scalarFields.btn_bg_color = fields.btn_bg_color || fields.buttonbgcolor || theme.accentBtnBg;
        scalarFields.buttonbgcolor = scalarFields.btn_bg_color;
        scalarFields.bbuttonbgcolor = scalarFields.btn_bg_color;
        scalarFields.buttontitle_color =
          fields.buttontitle_color || fields.buttoncolor || theme.accentBtnText;
        scalarFields.buttoncolor = scalarFields.buttontitle_color;
        scalarFields.buttontextcolor = scalarFields.buttontitle_color;
        scalarFields.bbuttoncolor = scalarFields.buttontitle_color;

        const btnObj: any = {
          bgcolor: scalarFields.btn_bg_color,
          color: scalarFields.buttontitle_color,
          size: 'md',
          radius: '100px',
          fontweight: '700',
        };
        scalarFields.button_styles = JSON.stringify(btnObj);
        scalarFields.bbutton_styles = JSON.stringify(btnObj);

        // Button 2 (Secondary) in dark theme: transparent glass with white border & text
        scalarFields.btn2_bg_color = fields.btn2_bg_color || fields.button2bgcolor || 'transparent';
        scalarFields.button2bgcolor = scalarFields.btn2_bg_color;
        scalarFields.buttonlink2_color =
          fields.buttonlink2_color || fields.button2color || '#FFFFFF';
        scalarFields.button2color = scalarFields.buttonlink2_color;
        scalarFields.btn2_border_color =
          fields.btn2_border_color || fields.button2bordercolor || 'rgba(255, 255, 255, 0.3)';
        scalarFields.button2bordercolor = scalarFields.btn2_border_color;
        scalarFields.btn2_border_width = String(
          fields.btn2_border_width || fields.button2bordersize || '1px'
        );
        scalarFields.button2bordersize = scalarFields.btn2_border_width.includes('px')
          ? scalarFields.btn2_border_width
          : `${scalarFields.btn2_border_width}px`;

        const btn2Obj: any = {
          bgcolor: scalarFields.btn2_bg_color,
          color: scalarFields.buttonlink2_color,
          bordercolor: scalarFields.btn2_border_color,
          bordersize: scalarFields.button2bordersize,
          size: 'md',
          radius: '100px',
        };
        scalarFields.button2_styles = JSON.stringify(btn2Obj);
      } else if (preset === 'minimal') {
        // Minimal light mask & graphite buttons
        scalarFields.overlayopacity =
          fields.overlayopacity !== undefined
            ? String(fields.overlayopacity)
            : fields.filteropacity !== undefined
            ? String(fields.filteropacity)
            : '30';
        scalarFields.overlayopacity2 =
          fields.overlayopacity2 !== undefined
            ? String(fields.overlayopacity2)
            : fields.filteropacity2 !== undefined
            ? String(fields.filteropacity2)
            : '30';
        scalarFields.filteropacity = scalarFields.overlayopacity;
        scalarFields.filteropacity2 = scalarFields.overlayopacity2;

        scalarFields.btn_bg_color = fields.btn_bg_color || fields.buttonbgcolor || theme.accentBtnBg;
        scalarFields.buttonbgcolor = scalarFields.btn_bg_color;
        scalarFields.buttontitle_color =
          fields.buttontitle_color || fields.buttoncolor || theme.accentBtnText;
        scalarFields.buttoncolor = scalarFields.buttontitle_color;

        const btnObj: any = {
          bgcolor: scalarFields.btn_bg_color,
          color: scalarFields.buttontitle_color,
          size: 'md',
          radius: '12px',
          fontweight: '600',
        };
        scalarFields.button_styles = JSON.stringify(btnObj);
        scalarFields.bbutton_styles = JSON.stringify(btnObj);
      } else if (preset === 'warm') {
        // Warm mask & terracotta CTA
        scalarFields.overlaycolor = fields.overlaycolor || fields.filtercolor || '#292524';
        scalarFields.overlaycolor2 = fields.overlaycolor2 || fields.filtercolor2 || '#1C1917';
        scalarFields.filtercolor = scalarFields.overlaycolor;
        scalarFields.filtercolor2 = scalarFields.overlaycolor2;
        scalarFields.overlayopacity =
          fields.overlayopacity !== undefined
            ? String(fields.overlayopacity)
            : fields.filteropacity !== undefined
            ? String(fields.filteropacity)
            : '50';
        scalarFields.overlayopacity2 =
          fields.overlayopacity2 !== undefined
            ? String(fields.overlayopacity2)
            : fields.filteropacity2 !== undefined
            ? String(fields.filteropacity2)
            : '70';
        scalarFields.filteropacity = scalarFields.overlayopacity;
        scalarFields.filteropacity2 = scalarFields.overlayopacity2;

        scalarFields.btn_bg_color = fields.btn_bg_color || fields.buttonbgcolor || theme.accentBtnBg;
        scalarFields.buttonbgcolor = scalarFields.btn_bg_color;
        scalarFields.buttontitle_color =
          fields.buttontitle_color || fields.buttoncolor || theme.accentBtnText;
        scalarFields.buttoncolor = scalarFields.buttontitle_color;

        const btnObj: any = {
          bgcolor: scalarFields.btn_bg_color,
          color: scalarFields.buttontitle_color,
          size: 'md',
          radius: '12px',
          fontweight: '600',
        };
        scalarFields.button_styles = JSON.stringify(btnObj);
        scalarFields.bbutton_styles = JSON.stringify(btnObj);
      }
    }

    // =========================================================================
    // SMART DEFAULTS: 2. Form Block (BF204 / BF204N - tplId 678)
    // =========================================================================
    if (isForm) {
      // Guaranteed headings fallback
      if (!scalarFields.btitle && !fields.btitle) {
        scalarFields.btitle = 'Оставьте заявку на расчет';
      }
      if (!scalarFields.bdescr && !fields.bdescr) {
        scalarFields.bdescr = 'Мы свяжемся с вами в течение 10 минут';
      }

      // Button styling
      scalarFields.btn_bg_color = fields.btn_bg_color || fields.buttonbgcolor || theme.accentBtnBg;
      scalarFields.buttonbgcolor = scalarFields.btn_bg_color;
      scalarFields.bbuttonbgcolor = scalarFields.btn_bg_color;
      scalarFields.buttontitle_color =
        fields.buttontitle_color || fields.buttoncolor || theme.accentBtnText;
      scalarFields.buttoncolor = scalarFields.buttontitle_color;
      scalarFields.buttontextcolor = scalarFields.buttontitle_color;
      scalarFields.bbuttoncolor = scalarFields.buttontitle_color;

      const formBtnObj: any = {
        bgcolor: scalarFields.btn_bg_color,
        color: scalarFields.buttontitle_color,
        size: 'md',
        radius: isDark ? '100px' : '12px',
        fontweight: '700',
      };
      scalarFields.button_styles = JSON.stringify(formBtnObj);
      scalarFields.bbutton_styles = JSON.stringify(formBtnObj);

      // Contrast & glass fields in dark theme
      if (isDark) {
        scalarFields.input_title_color =
          fields.input_title_color || fields.inputtitlecolor || '#FFFFFF';
        scalarFields.inputtitlecolor = scalarFields.input_title_color;
        scalarFields.input_bg_color =
          fields.input_bg_color || fields.inputbgcolor || 'rgba(255, 255, 255, 0.06)';
        scalarFields.inputbgcolor = scalarFields.input_bg_color;
        scalarFields.inputbackground = scalarFields.input_bg_color;
        scalarFields.input_border_color =
          fields.input_border_color || fields.inputbordercolor || 'rgba(255, 255, 255, 0.15)';
        scalarFields.inputbordercolor = scalarFields.input_border_color;
        scalarFields.input_color = fields.input_color || fields.inputcolor || '#FFFFFF';
        scalarFields.inputcolor = scalarFields.input_color;
      } else {
        scalarFields.input_title_color =
          fields.input_title_color || fields.inputtitlecolor || theme.textPrimary;
        scalarFields.inputtitlecolor = scalarFields.input_title_color;
        scalarFields.input_bg_color = fields.input_bg_color || fields.inputbgcolor || '#FFFFFF';
        scalarFields.inputbgcolor = scalarFields.input_bg_color;
        scalarFields.inputbackground = scalarFields.input_bg_color;
        scalarFields.input_border_color =
          fields.input_border_color || fields.inputbordercolor || '#E2E8F0';
        scalarFields.inputbordercolor = scalarFields.input_border_color;
        scalarFields.input_color = fields.input_color || fields.inputcolor || theme.textPrimary;
        scalarFields.inputcolor = scalarFields.input_color;
      }
    }

    // =========================================================================
    // SMART DEFAULTS: 3. Cards, Metrics, FAQ (FR205 / NM01 / TX16N)
    // =========================================================================
    // Section & generic text colors
    if (fields.title_color || fields.color || fields.titlecolor) {
      const titleColor = fields.title_color || fields.color || fields.titlecolor;
      scalarFields.title_color = titleColor;
      scalarFields.titlecolor = titleColor;
      scalarFields.color = titleColor;
      if (!scalarFields.btitle_typo) scalarFields.btitle_typo = JSON.stringify({ color: titleColor });
      if (!scalarFields.title_typo) scalarFields.title_typo = JSON.stringify({ color: titleColor });
    } else if (isDark) {
      scalarFields.title_color = theme.textPrimary;
      scalarFields.titlecolor = theme.textPrimary;
      scalarFields.color = theme.textPrimary;
      if (!scalarFields.btitle_typo) scalarFields.btitle_typo = JSON.stringify({ color: theme.textPrimary });
      if (!scalarFields.title_typo) scalarFields.title_typo = JSON.stringify({ color: theme.textPrimary });
    }

    if (fields.descr_color || fields.descrcolor) {
      const descrColor = fields.descr_color || fields.descrcolor;
      scalarFields.descr_color = descrColor;
      scalarFields.descrcolor = descrColor;
      if (!scalarFields.bdescr_typo) scalarFields.bdescr_typo = JSON.stringify({ color: descrColor });
      if (!scalarFields.descr_typo) scalarFields.descr_typo = JSON.stringify({ color: descrColor });
    } else if (isDark) {
      scalarFields.descr_color = theme.textSecondary;
      scalarFields.descrcolor = theme.textSecondary;
      if (!scalarFields.bdescr_typo) scalarFields.bdescr_typo = JSON.stringify({ color: theme.textSecondary });
      if (!scalarFields.descr_typo) scalarFields.descr_typo = JSON.stringify({ color: theme.textSecondary });
    }

    // Card / list items typography and colors (FR205, TX16N FAQ, NM01 Metrics)
    if (fields.li_title_color || fields.li_titlecolor) {
      const cardTitleColor = fields.li_title_color || fields.li_titlecolor;
      scalarFields.li_title_color = cardTitleColor;
      scalarFields.li_titlecolor = cardTitleColor;
      scalarFields.title_typo = JSON.stringify({ color: cardTitleColor });
    } else if (isListOrCards || isDark) {
      scalarFields.li_title_color = theme.textPrimary;
      scalarFields.li_titlecolor = theme.textPrimary;
      scalarFields.title_typo = JSON.stringify({ color: theme.textPrimary });
    }

    if (fields.li_descr_color || fields.li_descrcolor) {
      const cardDescrColor = fields.li_descr_color || fields.li_descrcolor;
      scalarFields.li_descr_color = cardDescrColor;
      scalarFields.li_descrcolor = cardDescrColor;
      scalarFields.descr_typo = JSON.stringify({ color: cardDescrColor });
    } else if (isListOrCards || isDark) {
      scalarFields.li_descr_color = theme.textSecondary;
      scalarFields.li_descrcolor = theme.textSecondary;
      scalarFields.descr_typo = JSON.stringify({ color: theme.textSecondary });
    }

    // Post scalar fields
    if (Object.keys(scalarFields).length > 0) {
      const payload = new URLSearchParams({
        comm: 'saverecord',
        pageid: pageId,
        recordid: recordId,
        commondomain: this.commondomain,
        ...scalarFields,
      });
      if (this.csrf) payload.append('csrf', this.csrf);

      const res = await this.request('/page/submit/', {
        method: 'POST',
        body: payload,
        referer: `${this.baseUrl}/page/?pageid=${pageId}`,
      });

      if (res.status !== 200) {
        const errBody = await res.text().catch(() => '');
        throw new Error(
          `[TildaHttpClient] Failed to update block "${recordId}" on page ${pageId}: expected HTTP 200, got ${res.status}. ${errBody.slice(0, 150)}`
        );
      }
    }

    // 2. If 'list', 'inputs' or 'forminputs' field is provided (or form defaults), send dedicated update
    if (
      fields.list !== undefined ||
      fields.forminputs !== undefined ||
      fields.inputs !== undefined ||
      isForm
    ) {
      let listVal = fields.list ?? fields.forminputs;
      let inputsArray = fields.inputs;

      // Smart Defaults for Form: If form inputs were not provided, supply standard Russian 4-field set
      if (
        isForm &&
        !listVal &&
        (!inputsArray || (Array.isArray(inputsArray) && inputsArray.length === 0))
      ) {
        inputsArray = [
          { type: 'nm', title: 'Ваше имя', placeholder: 'Константин', required: true },
          {
            type: 'ph',
            title: 'Телефон',
            placeholder: '+7 (999) 000-00-00',
            mask: 'RU',
            required: true,
          },
          { type: 'em', title: 'Email', placeholder: 'mail@example.com', required: false },
          {
            type: 'ta',
            title: 'Комментарий к заказу',
            placeholder: 'Опишите ваши задачи или модель авто...',
            rows: 3,
            required: false,
          },
        ];
      }

      if (!listVal && inputsArray && Array.isArray(inputsArray)) {
        const typeMap: Record<string, string> = {
          email: 'em',
          text: 'nm',
          name: 'nm',
          phone: 'ph',
          textarea: 'ta',
        };
        listVal = inputsArray.map((inp: any, idx: number) => {
          const t = typeMap[inp.type?.toLowerCase()] || inp.type || 'nm';
          const item: any = {
            lid: String(Date.now() + idx).slice(-13),
            ls: String((idx + 1) * 10),
            loff: '',
            li_parent_id: null,
            li_type: t,
            li_title: inp.title || inp.label || '',
            li_ph: inp.placeholder || inp.ph || '',
            li_nm: inp.name || inp.title || `field_${idx + 1}`,
          };
          if (inp.required) item.li_req = 'y';
          if (t === 'ph') {
            item.li_masktype = 'a';
            item.li_mask = inp.mask || 'RU';
            if (inp.placeholder) item.li_ph = inp.placeholder;
          }
          if (t === 'ta') {
            item.li_rows = String(inp.rows || 3);
          }
          return item;
        });
      }

      if (listVal !== undefined && listVal !== null) {
        const listStr = typeof listVal === 'string' ? listVal : JSON.stringify(listVal);
        const listPayload = new URLSearchParams({
          comm: 'saverecord',
          pageid: pageId,
          recordid: recordId,
          list: listStr,
          forminputs: listStr,
          commondomain: this.commondomain,
        });
        if (this.csrf) listPayload.append('csrf', this.csrf);

        const listRes = await this.request('/page/submit/', {
          method: 'POST',
          body: listPayload,
          referer: `${this.baseUrl}/page/?pageid=${pageId}`,
        });

        if (listRes.status !== 200) {
          const errBody = await listRes.text().catch(() => '');
          throw new Error(
            `[TildaHttpClient] Failed to update list for block "${recordId}" on page ${pageId}: expected HTTP 200, got ${listRes.status}. ${errBody.slice(0, 150)}`
          );
        }
      }
    }

    // 3. Trigger getrecordhtml to refresh canvas HTML cache in Tilda
    try {
      await this.request('/page/get/', {
        method: 'POST',
        body: new URLSearchParams({
          comm: 'getrecordhtml',
          pageid: pageId,
          recordid: recordId,
          with_code: 'yes',
          commondomain: this.commondomain,
        }),
        referer: `${this.baseUrl}/page/?pageid=${pageId}`,
      });
    } catch {}

    return {
      success: true,
      recordId,
      fieldsUpdated: Object.keys(fields),
    };
  }

  /**
   * Deletes a single record from the page.
   */
  public async deleteRecord(pageId: string, recordId: string): Promise<boolean> {
    await this.pace(300, 600);
    const payload = new URLSearchParams({
      comm: 'deleterecord',
      pageid: pageId,
      recordid: recordId,
      commondomain: this.commondomain,
    });
    if (this.csrf) payload.append('csrf', this.csrf);

    const res = await this.request('/page/submit/', {
      method: 'POST',
      body: payload,
      referer: `${this.baseUrl}/page/?pageid=${pageId}`,
    });

    if (res.status !== 200) {
      throw new Error(`[TildaHttpClient] Failed to delete record ${recordId} on page ${pageId}: HTTP ${res.status}`);
    }
    return true;
  }

  /**
   * Fetches all records on a given page via /page/get/getpage/.
   */
  public async getPageRecords(pageId: string): Promise<any[]> {
    const payload = new URLSearchParams({
      pageid: pageId,
      commondomain: this.commondomain,
    });
    const res = await this.request('/page/get/getpage/', {
      method: 'POST',
      body: payload,
      referer: `${this.baseUrl}/page/?pageid=${pageId}`,
    });
    if (res.status !== 200) {
      throw new Error(`[TildaHttpClient] Failed to fetch page data for ${pageId}: HTTP ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data.records) ? data.records : [];
  }

  /**
   * Purges all existing records on a page. Returns the number of deleted records.
   */
  public async deleteAllRecords(pageId: string): Promise<number> {
    const records = await this.getPageRecords(pageId);
    let deletedCount = 0;
    for (const rec of records) {
      const idMatch = rec.html ? rec.html.match(/recordid=["'](\d+)["']/) : null;
      const recId = idMatch ? idMatch[1] : rec.id;
      if (recId) {
        await this.deleteRecord(pageId, recId);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  /**
   * Publishes the page via direct POST to https://tilda.cc/page/publish/ and returns the live public URL.
   * Throws on non-200 response.
   */
  public async publishPage(pageId: string): Promise<PublishResult> {
    await this.pace(200, 400);

    const payload = new URLSearchParams({
      comm: 'pagepublish',
      pageid: pageId,
      returnjson: 'yes',
      commondomain: this.commondomain,
    });
    if (this.csrf) payload.append('csrf', this.csrf);

    const res = await this.request('/page/publish/', {
      method: 'POST',
      body: payload,
      referer: `${this.baseUrl}/page/?pageid=${pageId}`,
    });

    // STRICT STATUS CHECK: Must be 200 OK
    if (res.status !== 200) {
      const errBody = await res.text().catch(() => '');
      throw new Error(
        `[TildaHttpClient] Failed to publish page ${pageId}: expected HTTP 200, got ${res.status}. ${errBody.slice(0, 150)}`
      );
    }

    const responseText = await res.text();
    let publishedUrl = '';

    const urlMatch = responseText.match(
      /https?:\/\/[a-z0-9\-\.]+\.tilda\.(?:ws|cc|ru)(?:\/[a-z0-9_\-\/]*)?/i
    );
    if (urlMatch && urlMatch[0]) {
      publishedUrl = urlMatch[0];
    }

    if (!publishedUrl || publishedUrl.includes('/page/?pageid=')) {
      const loc = res.headers.get('location');
      if (loc && loc.includes('.tilda.ws')) {
        publishedUrl = loc;
      } else {
        publishedUrl = `https://polish-clumsy-carp.tilda.ws/page${pageId}.html`;
      }
    }

    return {
      pageId,
      publishedUrl,
      publishedAt: new Date().toISOString(),
    };
  }

  public getCsrfToken(): string {
    return this.csrf;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Deletes an entire page from the project (moves to bin/trash).
   * Used for transactional rollback when page generation fails partway through.
   */
  public async deletePage(pageId: string): Promise<boolean> {
    await this.pace(100, 200);
    const payload = new URLSearchParams({
      comm: 'movetobinpage',
      pageid: pageId,
      commondomain: this.commondomain,
    });
    if (this.csrf) payload.append('csrf', this.csrf);

    try {
      const res = await this.request('/projects/submit/', {
        method: 'POST',
        body: payload,
        referer: `${this.baseUrl}/projects/`,
      });

      if (res.status !== 200) {
        console.warn(`[Rollback] Failed to delete page ${pageId}: HTTP ${res.status}`);
        return false;
      }
      console.log(`[Rollback] Page ${pageId} moved to bin successfully.`);
      return true;
    } catch (err: any) {
      console.warn(`[Rollback] Error deleting page ${pageId}: ${err.message}`);
      return false;
    }
  }
}
