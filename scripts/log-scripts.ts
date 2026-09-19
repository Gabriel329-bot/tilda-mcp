import { chromium } from 'playwright';
import { STORAGE_STATE_PATH } from '../src/config.js';

async function logAllScripts() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
  const page = await context.newPage();

  page.on('request', (req) => {
    const url = req.url();
    if (url.endsWith('.js') || url.includes('.js?') || url.includes('/get/') || url.includes('/tpl/')) {
      console.log(`[SCRIPT] ${url}`);
    }
  });

  console.log('Navigating to editor...');
  await page.goto('https://tilda.ru/page/?pageid=253396603', { waitUntil: 'networkidle' });
  await browser.close();
}

logAllScripts().catch(console.error);
