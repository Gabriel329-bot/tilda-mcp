import fs from 'fs';
import path from 'path';
import { chromium, BrowserContext } from 'playwright';
import { STORAGE_STATE_PATH, TILDA_URLS, TIMEOUTS, BRAVE_EXECUTABLE_PATH } from '../config.js';

export interface SessionStatus {
  valid: boolean;
  message: string;
  storageStatePath: string;
  userEmail?: string;
}

export class SessionManager {
  private storagePath: string;

  constructor(customStoragePath?: string) {
    this.storagePath = customStoragePath || STORAGE_STATE_PATH;
  }

  /**
   * Checks whether the storage_state.json file exists on disk.
   */
  public hasStorageState(): boolean {
    return fs.existsSync(this.storagePath);
  }

  /**
   * Validates the saved session by loading cookies into a headless browser
   * and checking if Tilda redirects to the login page.
   */
  public async validateSession(): Promise<SessionStatus> {
    if (!this.hasStorageState()) {
      return {
        valid: false,
        message: `Storage state file not found at "${this.storagePath}". Please run "npm run login" first.`,
        storageStatePath: this.storagePath,
      };
    }

    const browser = await chromium.launch({
      headless: true,
      executablePath: BRAVE_EXECUTABLE_PATH || undefined,
      args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
    });
    let context: BrowserContext | null = null;

    try {
      context = await browser.newContext({
        storageState: this.storagePath,
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      });

      const page = await context.newPage();
      await page.goto(TILDA_URLS.PROJECTS, {
        waitUntil: 'domcontentloaded',
        timeout: TIMEOUTS.NAVIGATION,
      });

      const currentUrl = page.url();

      if (currentUrl.includes('/login/')) {
        return {
          valid: false,
          message:
            'Tilda session expired. Redirected to /login/. Please re-authenticate via "npm run login".',
          storageStatePath: this.storagePath,
        };
      }

      // Check if page loaded projects dashboard
      const isProjectsPage =
        currentUrl.includes('/projects/') ||
        (await page.$('.tp-project-actions, #allprojects, .tp-menu')) !== null;

      if (!isProjectsPage) {
        return {
          valid: false,
          message: `Unexpected landing page: ${currentUrl}. Session might be invalid.`,
          storageStatePath: this.storagePath,
        };
      }

      return {
        valid: true,
        message: 'Session is active and authenticated.',
        storageStatePath: this.storagePath,
      };
    } catch (err: any) {
      return {
        valid: false,
        message: `Error validating session: ${err.message}`,
        storageStatePath: this.storagePath,
      };
    } finally {
      if (context) await context.close();
      await browser.close();
    }
  }

  /**
   * Ensures session is valid before performing automated actions.
   * Throws detailed error if session is missing or expired.
   */
  public async assertAuthenticated(): Promise<void> {
    const status = await this.validateSession();
    if (!status.valid) {
      throw new Error(
        `[Tilda Session Error] ${status.message}\n` +
          `Action required: Run "npm run login" in your terminal to complete manual headful login.`
      );
    }
  }

  public getStoragePath(): string {
    return this.storagePath;
  }
}
