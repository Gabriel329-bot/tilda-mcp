import { chromium } from 'playwright';
import { STORAGE_STATE_PATH } from '../src/config.js';

async function checkBrowserCsrf() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
  const page = await context.newPage();

  // Listen to network requests made by the editor
  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('csrf') || url.includes('/page/') || url.includes('token')) {
      console.log(`[REQ] ${req.method()} ${url}`);
      if (req.method() === 'POST') {
        console.log(`      PostData: ${req.postData()}`);
      }
    }
  });

  console.log('Opening page in Playwright...');
  await page.goto('https://tilda.cc/page/?pageid=253396603', { waitUntil: 'networkidle' });

  const result = await page.evaluate(() => {
    const metaCsrf = document.querySelector('meta[name="csrf"]')?.getAttribute('content');
    const idCsrf = document.querySelector('#csrf')?.getAttribute('content');
    const inputCsrf = document.querySelector('input[name="csrf"]')?.getAttribute('value');
    const dataCsrf = document.querySelector('[data-csrf]')?.getAttribute('data-csrf');
    const w = window as any;
    return {
      metaCsrf,
      idCsrf,
      inputCsrf,
      dataCsrf,
      windowCsrf: w.csrf,
      windowTildaCsrf: w.tildaCsrf,
      allWindowKeys: Object.keys(w).filter(k => k.toLowerCase().includes('csrf') || k.toLowerCase().includes('token')),
    };
  });

  console.log('\nDOM CSRF evaluation:');
  console.log(JSON.stringify(result, null, 2));

  await browser.close();
}

checkBrowserCsrf().catch(console.error);
