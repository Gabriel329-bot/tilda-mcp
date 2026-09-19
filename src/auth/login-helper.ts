import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { chromium } from 'playwright';
import { STORAGE_STATE_PATH, STORAGE_DIR, TILDA_URLS, DEFAULT_USER_AGENT } from '../config.js';

async function runLoginHelper(): Promise<void> {
  console.log('====================================================');
  console.log('       Tilda Publishing - Interactive Login         ');
  console.log('====================================================');
  console.log('Launching browser in visible (headful) mode...');

  // Ensure storage directory exists
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }

  const candidateBravePaths = [
    'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    'C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    path.join(process.env.LOCALAPPDATA || '', 'BraveSoftware\\Brave-Browser\\Application\\brave.exe'),
  ];
  const bravePath = candidateBravePaths.find((p) => fs.existsSync(p));

  if (bravePath) {
    console.log(`[BROWSER] Found Brave browser: ${bravePath}`);
  }

  const tempUserDataDir = path.join(STORAGE_DIR, 'brave_auth_profile');
  if (!fs.existsSync(tempUserDataDir)) {
    fs.mkdirSync(tempUserDataDir, { recursive: true });
  }

  console.log(`Using dedicated browser profile: ${tempUserDataDir}`);

  const context = await chromium.launchPersistentContext(tempUserDataDir, {
    headless: false,
    executablePath: bravePath || undefined,
    viewport: null,
    userAgent: DEFAULT_USER_AGENT,
    args: [
      '--start-maximized',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const pages = context.pages();
  const page = pages.length > 0 ? pages[0] : await context.newPage();

  console.log(`Navigating to Tilda Login: ${TILDA_URLS.LOGIN}`);
  await page.goto(TILDA_URLS.LOGIN, { waitUntil: 'domcontentloaded' });

  console.log('\n[ИНСТРУКЦИЯ]');
  console.log('1. В открывшемся окне Brave введите ваш логин и пароль Tilda.');
  console.log('2. Пройдите капчу или введите СМС-код (2FA), если потребуется.');
  console.log('3. Дождитесь, пока откроется список ваших проектов (https://tilda.cc/projects/ или tilda.ru).');
  console.log('4. ТОЛЬКО ПОСЛЕ ЭТОГО вернитесь в этот терминал и нажмите [ENTER].\n');

  let rl: readline.Interface | null = null;
  let enterPromise = new Promise<string>(() => {});

  if (process.stdin.isTTY) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    enterPromise = new Promise<string>((resolve) => {
      rl!.question('Нажмите [ENTER] здесь ПОСЛЕ ТОГО, как вы вошли в аккаунт: ', () => {
        rl?.close();
        resolve('manual_enter');
      });
    });
  }

  const autoDetectPromise = new Promise<string>((resolve) => {
    const checkUrl = async () => {
      try {
        const url = page.url();
        if (url.includes('/projects') || url.includes('/page/')) {
          resolve('auto_detected');
          return;
        }
      } catch {}
      setTimeout(checkUrl, 1000);
    };
    checkUrl();
  });

  const trigger = await Promise.race([enterPromise, autoDetectPromise]);
  console.log(`\n[SUCCESS] Вход подтвержден (${trigger === 'auto_detected' ? 'автоматически обнаружен переход в проекты' : 'ручное подтверждение'})!`);
  console.log('Экспорт сессии и кук из браузера...');

  await page.waitForTimeout(1000);

  // Save session state to disk
  await context.storageState({ path: STORAGE_STATE_PATH });

  // Read and verify cookies
  const cookies = await context.cookies();
  const phpSess = cookies.find((c) => c.name === 'PHPSESSID');
  const userId = cookies.find((c) => c.name === 'userid');
  console.log(`\n[INFO] Авторизованный аккаунт: UserID = ${userId?.value || 'н/д'}, PHPSESSID = ${phpSess?.value?.slice(0, 8)}...`);

  console.log(`[SUCCESS] Сессия успешно сохранена в:`);
  console.log(`-> ${STORAGE_STATE_PATH}`);
  console.log('Готово к работе!\n');

  rl?.close();
  await page.waitForTimeout(1000);
  await context.close();
}

runLoginHelper().catch((err) => {
  console.error('[ERROR] Login helper failed:', err.message);
  process.exit(1);
});
