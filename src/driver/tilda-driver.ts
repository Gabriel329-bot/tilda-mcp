import fs from 'fs';
import path from 'path';
import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { SessionManager } from '../auth/session-manager.js';
import {
  SCREENSHOTS_DIR,
  STORAGE_STATE_PATH,
  TILDA_URLS,
  TIMEOUTS,
  VIEWPORTS,
  BRAVE_EXECUTABLE_PATH,
} from '../config.js';
import { SELECTORS } from './selectors.js';
import { setAceEditorValue } from './ace-helper.js';
import {
  BlockInsertionResult,
  CreatePageResult,
  PublishResult,
  VisualInspectionResult,
} from '../types/index.js';

export class TildaPlaywrightDriver {
  private sessionManager: SessionManager;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private headless: boolean;

  constructor(options: { headless?: boolean; customStoragePath?: string } = {}) {
    this.headless = options.headless !== undefined ? options.headless : true;
    this.sessionManager = new SessionManager(options.customStoragePath || STORAGE_STATE_PATH);
  }

  /**
   * Initializes browser instance with saved session state.
   */
  public async init(): Promise<void> {
    if (this.browser && this.context && this.page) {
      return;
    }

    await this.sessionManager.assertAuthenticated();

    // Ensure screenshots folder exists
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }

    this.browser = await chromium.launch({
      headless: this.headless,
      executablePath: BRAVE_EXECUTABLE_PATH || undefined,
      args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
    });

    this.context = await this.browser.newContext({
      storageState: this.sessionManager.getStoragePath(),
      viewport: VIEWPORTS.DESKTOP,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    });

    this.page = await this.context.newPage();
  }

  /**
   * Closes browser resources.
   */
  public async close(): Promise<void> {
    if (this.page) {
      await this.page.close().catch(() => {});
      this.page = null;
    }
    if (this.context) {
      await this.context.close().catch(() => {});
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close().catch(() => {});
      this.browser = null;
    }
  }

  /**
   * Safely returns active page or initializes driver.
   */
  private async getPage(): Promise<Page> {
    if (!this.page || this.page.isClosed()) {
      await this.init();
    }
    return this.page!;
  }

  /**
   * Navigates to a Tilda page editor and waits for DOM readiness.
   */
  public async navigateToPage(pageId: string): Promise<Page> {
    const page = await this.getPage();
    const targetUrl = `${TILDA_URLS.PAGE_BASE}${pageId}`;

    if (page.url() !== targetUrl) {
      await page.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: TIMEOUTS.NAVIGATION,
      });
    }

    // Check if redirected to login
    if (page.url().includes('/login/')) {
      throw new Error(
        'Session expired while opening Tilda page editor. Please run "npm run login".'
      );
    }

    // Wait for the records canvas to load
    await page.waitForSelector(SELECTORS.editor.canvas, {
      timeout: TIMEOUTS.NAVIGATION,
    });

    return page;
  }

  /**
   * Creates a new page inside the given project.
   */
  public async createPage(projectId: string, title?: string): Promise<CreatePageResult> {
    const page = await this.getPage();
    const projectUrl = `${TILDA_URLS.PROJECTS}?projectid=${projectId}`;

    await page.goto(projectUrl, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUTS.NAVIGATION,
    });

    if (page.url().includes('/login/')) {
      throw new Error('Session expired. Please run "npm run login".');
    }

    // Click "Создать новую страницу" button
    let clickedCreate = false;
    for (const selector of SELECTORS.project.createNewPageBtn) {
      const btn = await page.$(selector);
      if (btn && (await btn.isVisible())) {
        await btn.click();
        clickedCreate = true;
        break;
      }
    }

    if (!clickedCreate) {
      throw new Error('Could not find "Create new page" button on project dashboard.');
    }

    // Wait for template chooser and select Blank Page
    await page.waitForTimeout(1000);
    let selectedBlank = false;
    for (const selector of SELECTORS.project.blankPageTemplate) {
      const templateBtn = await page.$(selector);
      if (templateBtn && (await templateBtn.isVisible())) {
        await templateBtn.click();
        selectedBlank = true;
        break;
      }
    }

    if (!selectedBlank) {
      // Fallback: wait for URL change to page editor
      await page.waitForURL(/page\/\?pageid=\d+/, { timeout: TIMEOUTS.ACTION }).catch(() => {});
    }

    // Wait for page editor URL: https://tilda.cc/page/?pageid=12345678
    await page.waitForURL(/page\/\?pageid=\d+/, { timeout: TIMEOUTS.NAVIGATION });

    const currentUrl = page.url();
    const match = currentUrl.match(/pageid=(\d+)/);
    if (!match || !match[1]) {
      throw new Error(`Failed to extract new page ID from URL: ${currentUrl}`);
    }

    const pageId = match[1];

    return {
      pageId,
      editUrl: currentUrl,
      title: title || 'New AI Page',
    };
  }

  /**
   * Inserts a T123 (HTML-код) block into the page, opens Content, injects code, and saves.
   */
  public async insertHtmlBlock(
    pageId: string,
    fullCode: string,
    targetRecordId?: string
  ): Promise<BlockInsertionResult> {
    const page = await this.navigateToPage(pageId);

    // Get list of existing record IDs before insertion
    const existingRecordIds = await page.$$eval(
      `${SELECTORS.editor.records}[data-record-id]`,
      (els) => els.map((el) => el.getAttribute('data-record-id') || '')
    );

    // Click Add Block Button
    let clickedAdd = false;

    if (targetRecordId) {
      // Find plus icon for target record
      for (const selector of SELECTORS.addBlock.plusButtonForRecord(targetRecordId)) {
        const plusBtn = await page.$(selector);
        if (plusBtn) {
          await plusBtn.scrollIntoViewIfNeeded();
          await plusBtn.click({ force: true });
          clickedAdd = true;
          break;
        }
      }
    }

    // If target record plus not clicked, try empty page add button or bottom plus
    if (!clickedAdd) {
      const candidateSelectors = [
        ...SELECTORS.addBlock.emptyPageAddBtn,
        ...SELECTORS.addBlock.plusButtonBottom,
      ];
      for (const selector of candidateSelectors) {
        const btn = await page.$(selector);
        if (btn && (await btn.isVisible())) {
          await btn.scrollIntoViewIfNeeded();
          await btn.click({ force: true });
          clickedAdd = true;
          break;
        }
      }
    }

    if (!clickedAdd) {
      // Fallback: try hovering last record or clicking general add button
      const lastRecord = await page.$(`${SELECTORS.editor.records}:last-child`);
      if (lastRecord) {
        await lastRecord.hover();
        const plus = await page.$('.tp-record-edit-icons__plus');
        if (plus) {
          await plus.click({ force: true });
          clickedAdd = true;
        }
      }
    }

    if (!clickedAdd) {
      // Fallback: evaluate opening library directly via window.tp__library__open()
      const opened = await page.evaluate(() => {
        const win = window as any;
        if (typeof win.tp__library__open === 'function') {
          win.tp__library__open();
          return true;
        }
        return false;
      });
      if (opened) {
        clickedAdd = true;
      }
    }

    if (!clickedAdd) {
      throw new Error('Failed to click "+ / Add block" button in Tilda editor.');
    }

    // 1. Wait for Block Library drawer/modal to open
    await page.waitForSelector('.tp-library, .tp-popup-lib, #tp-library, .tp-record-library', {
      timeout: TIMEOUTS.ACTION,
    });

    // 2. Search input "T123"
    const searchInput = await page.$(
      'input.tp-library__search-input, input[placeholder*="Поиск"], #tp-lib-search, input.tp-search__input'
    );
    if (searchInput) {
      await searchInput.fill('');
      await searchInput.fill('T123');
      await page.waitForTimeout(500); // pause for filtering
    }

    // 3. Click block card T123
    let blockSelected = await page.evaluate(() => {
      // Option A: Direct template attribute
      const directCard = document.querySelector<HTMLElement>(
        '[data-tpl="123"], [data-block-uid="123"], [data-tpl-id="123"]'
      );
      if (directCard) {
        directCard.click();
        return 'clicked by data-tpl';
      }

      // Option B: Search text "T123" or "HTML"
      const allItems = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.tp-library__item, .tp-lib-item, .tp-popup-lib__item, .tp-library__tpl-body'
        )
      );
      const target = allItems.find((el) => {
        const text = el.innerText || el.textContent || '';
        return text.includes('T123') || text.includes('HTML');
      });

      if (target) {
        target.click();
        return 'clicked by text match';
      }

      return null;
    });

    if (!blockSelected) {
      // Fallback: Click "Другое" / "Other" category and find HTML card
      await page.evaluate(() => {
        const types = Array.from(
          document.querySelectorAll('.tp-library__type, .tp-library__category, a, div')
        ) as HTMLElement[];
        const other = types.find(
          (el) =>
            (el.textContent || '').trim() === 'Другое' || (el.textContent || '').trim() === 'Other'
        );
        if (other) other.click();
      });
      await page.waitForTimeout(600);

      blockSelected = await page.evaluate(() => {
        const bodies = Array.from(
          document.querySelectorAll<HTMLElement>(
            '.tp-library__tpl-body, .tp-library__item, [data-tpl="123"]'
          )
        );
        const htmlCard = bodies.find(
          (b) => (b.textContent || '').includes('HTML') || (b.textContent || '').includes('T123')
        );
        if (htmlCard) {
          htmlCard.click();
          return 'clicked other->html';
        }
        return null;
      });
    }

    if (!blockSelected) {
      throw new Error('Could not select block T123 (HTML-код) from Tilda library.');
    }

    // Wait for new record to appear in the DOM
    let newRecordId = '';
    const maxAttempts = 15;
    for (let i = 0; i < maxAttempts; i++) {
      await page.waitForTimeout(400);
      const currentRecordIds = await page.$$eval(
        `${SELECTORS.editor.records}[data-record-id]`,
        (els) => els.map((el) => el.getAttribute('data-record-id') || '')
      );

      const diff = currentRecordIds.filter((id) => id && !existingRecordIds.includes(id));
      if (diff.length > 0) {
        newRecordId = diff[diff.length - 1];
        break;
      }
    }

    // If diff detection didn't find new ID, pick the last record ID
    if (!newRecordId) {
      const lastId = await page.$eval(
        `${SELECTORS.editor.records}:last-child`,
        (el) => el.getAttribute('data-record-id') || el.id.replace('record', '')
      );
      newRecordId = lastId;
    }

    if (!newRecordId) {
      throw new Error('Could not detect the ID of the newly added record in DOM.');
    }

    // Open Content modal for this record
    await this.openRecordContent(page, newRecordId);

    // Inject code into Ace Editor
    await setAceEditorValue(page, fullCode);

    // Save and close modal
    await this.saveAndCloseContentModal(page);

    return {
      recordId: newRecordId,
      blockId: '',
      pageId,
    };
  }

  /**
   * Updates the HTML/CSS/JS code of an existing T123 block.
   */
  public async updateHtmlBlock(
    pageId: string,
    recordId: string,
    updatedCode: string
  ): Promise<{ success: boolean; recordId: string; codeLength: number }> {
    const page = await this.navigateToPage(pageId);

    // Ensure record exists
    const recordSelector = SELECTORS.editor.recordById(recordId);
    const recordEl = await page.$(recordSelector);
    if (!recordEl) {
      throw new Error(`Record with ID "${recordId}" was not found on page ${pageId}.`);
    }

    // Open Content modal
    await this.openRecordContent(page, recordId);

    // Inject updated code into Ace Editor
    const injectionResult = await setAceEditorValue(page, updatedCode);

    // Save and close modal
    await this.saveAndCloseContentModal(page);

    return {
      success: true,
      recordId,
      codeLength: injectionResult.length,
    };
  }

  /**
   * Helper to open the Content modal for a specific record.
   */
  private async openRecordContent(page: Page, recordId: string): Promise<void> {
    const recordSelector = SELECTORS.editor.recordById(recordId);
    const recordEl = await page.waitForSelector(recordSelector, { timeout: TIMEOUTS.ACTION });

    if (!recordEl) {
      throw new Error(`Cannot locate record element for recordId: ${recordId}`);
    }

    await recordEl.scrollIntoViewIfNeeded();
    await recordEl.hover();
    await page.waitForTimeout(300);

    // Click Content button
    let clickedContent = false;
    for (const sel of SELECTORS.recordControls.contentBtn(recordId)) {
      const btn = await page.$(sel);
      if (btn && (await btn.isVisible())) {
        await btn.click({ force: true });
        clickedContent = true;
        break;
      }
    }

    if (!clickedContent) {
      // Try evaluating click directly on the content link in the record or calling Tilda function
      const evaluatedClick = await page.evaluate((recId: string) => {
        const rec =
          document.getElementById(`record${recId}`) ||
          document.querySelector(`[data-record-id="${recId}"]`);
        if (rec) {
          const btn = rec.querySelector(
            'a[data-menu="content"], .tp-record-edit-icons__btn_content, .tp-record-edit-icons__item'
          ) as HTMLElement;
          if (btn) {
            btn.click();
            return true;
          }
        }
        const win = window as any;
        if (typeof win.tp__record__edit_content === 'function') {
          win.tp__record__edit_content(recId);
          return true;
        }
        if (typeof win.tp__record__edit === 'function') {
          win.tp__record__edit(recId);
          return true;
        }
        return false;
      }, recordId);

      if (evaluatedClick) {
        clickedContent = true;
      }
    }

    if (!clickedContent) {
      throw new Error(`Failed to click "Контент" button for record ${recordId}.`);
    }

    // Wait for content modal to be visible
    await page.waitForSelector('.tp-popup-window, #editrecord, .tp-form-body', {
      state: 'visible',
      timeout: TIMEOUTS.ACTION,
    });
  }

  /**
   * Helper to click "Сохранить и закрыть" and wait for modal closure.
   */
  private async saveAndCloseContentModal(page: Page): Promise<void> {
    let clickedSave = false;

    for (const saveSel of SELECTORS.contentModal.saveAndCloseBtn) {
      const btn = await page.$(saveSel);
      if (btn && (await btn.isVisible())) {
        await btn.click({ force: true });
        clickedSave = true;
        break;
      }
    }

    if (!clickedSave) {
      // Fallback click via evaluation
      clickedSave = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, a, input[type="submit"]'));
        const saveBtn = buttons.find((b) =>
          (b.textContent || (b as HTMLInputElement).value || '').includes('Сохранить')
        ) as HTMLElement;
        if (saveBtn) {
          saveBtn.click();
          return true;
        }
        return false;
      });
    }

    if (!clickedSave) {
      throw new Error('Failed to click "Сохранить и закрыть" button in content modal.');
    }

    // Wait for modal to disappear or save indicator to clear
    await page.waitForTimeout(1000);
  }

  /**
   * Captures Desktop and Mobile screenshots for multimodal Vision inspection.
   */
  public async takePreviewScreenshots(pageId: string): Promise<VisualInspectionResult> {
    const page = await this.getPage();
    const previewUrl = `https://tilda.cc/page/?pageid=${pageId}&preview=yes`;

    await page.goto(previewUrl, {
      waitUntil: 'networkidle',
      timeout: TIMEOUTS.NAVIGATION,
    }).catch(async () => {
      // Fallback if networkidle times out
      await page.goto(previewUrl, { waitUntil: 'domcontentloaded' });
    });

    const timestamp = Date.now();
    const desktopScreenshotPath = path.join(
      SCREENSHOTS_DIR,
      `preview-${pageId}-desktop-${timestamp}.png`
    );
    const mobileScreenshotPath = path.join(
      SCREENSHOTS_DIR,
      `preview-${pageId}-mobile-${timestamp}.png`
    );

    // 1. Desktop capture (1440x900)
    await page.setViewportSize(VIEWPORTS.DESKTOP);
    await page.waitForTimeout(600); // Allow responsive CSS transitions
    const desktopBuffer = await page.screenshot({
      path: desktopScreenshotPath,
      fullPage: true,
    });
    const desktopBase64 = desktopBuffer.toString('base64');

    // 2. Mobile capture (390x844)
    await page.setViewportSize(VIEWPORTS.MOBILE);
    await page.waitForTimeout(600); // Allow responsive media queries to reflow
    const mobileBuffer = await page.screenshot({
      path: mobileScreenshotPath,
      fullPage: true,
    });
    const mobileBase64 = mobileBuffer.toString('base64');

    // Restore desktop viewport
    await page.setViewportSize(VIEWPORTS.DESKTOP);

    return {
      pageId,
      desktopScreenshotPath,
      desktopBase64,
      mobileScreenshotPath,
      mobileBase64,
      previewUrl,
    };
  }

  /**
   * Publishes the page and returns the live public URL.
   */
  public async publishPage(pageId: string): Promise<PublishResult> {
    const page = await this.navigateToPage(pageId);

    // Click "Опубликовать" in the top navigation bar
    let clickedPublish = false;
    for (const sel of SELECTORS.publish.publishBtn) {
      const btn = await page.$(sel);
      if (btn && (await btn.isVisible())) {
        await btn.click();
        clickedPublish = true;
        break;
      }
    }

    if (!clickedPublish) {
      throw new Error('Could not find "Опубликовать" (Publish) button in Tilda header.');
    }

    // Wait for the publish confirmation popup
    await page.waitForSelector(
      '.tp-popup-window, #popup-publish, .tp-popup-publish',
      { state: 'visible', timeout: TIMEOUTS.PUBLISH }
    );

    await page.waitForTimeout(1000);

    // Extract live published URL
    let publishedUrl = '';
    for (const linkSel of SELECTORS.publish.publishedPageLink) {
      const linkEl = await page.$(linkSel);
      if (linkEl) {
        const href = await linkEl.getAttribute('href');
        if (href && href.startsWith('http')) {
          publishedUrl = href;
          break;
        }
      }
    }

    // Fallback: evaluate text inside the popup to extract URL
    if (!publishedUrl) {
      publishedUrl = await page.evaluate(() => {
        const links = Array.from(
          document.querySelectorAll<HTMLAnchorElement>('.tp-popup-window a[href^="http"]')
        );
        const wsLink = links.find(
          (a) => a.href.includes('.tilda.ws') || a.href.includes('.tilda.cc')
        );
        return wsLink ? wsLink.href : (links[0] ? links[0].href : '');
      });
    }

    // Close the publish popup if close button is present
    for (const closeSel of SELECTORS.publish.publishCloseBtn) {
      const closeBtn = await page.$(closeSel);
      if (closeBtn && (await closeBtn.isVisible())) {
        await closeBtn.click().catch(() => {});
        break;
      }
    }

    if (!publishedUrl) {
      publishedUrl = `https://tilda.cc/page/?pageid=${pageId}`;
    }

    return {
      pageId,
      publishedUrl,
      publishedAt: new Date().toISOString(),
    };
  }
}
