import { chromium } from 'playwright';
import { STORAGE_STATE_PATH } from '../src/config.js';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
  const page = await context.newPage();

  page.on('request', (req) => {
    const url = req.url();
    if (!url.includes('.png') && !url.includes('.css') && !url.includes('.woff') && !url.includes('.svg')) {
      console.log(`[REQ] ${req.method()} ${url}`);
      if (req.method() === 'POST') {
        console.log(`      POST data: ${req.postData()}`);
      }
    }
  });

  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('csrf') || url.includes('/page/') || url.includes('token') || url.includes('block')) {
      console.log(`[RES] ${res.status()} ${url}`);
      try {
        const text = await res.text();
        console.log(`      Response snippet: ${text.slice(0, 200)}`);
      } catch {}
    }
  });

  console.log('Navigating to editor: https://tilda.ru/page/?pageid=253396603');
  await page.goto('https://tilda.ru/page/?pageid=253396603', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Check what meta csrf or window.csrf has in the browser DOM
  const domInfo = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="csrf"]')?.getAttribute('content');
    const id = document.querySelector('#csrf')?.getAttribute('content');
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.textContent || '');
    const csrfInScripts = scripts.filter(s => s.includes('csrf'));
    const w = window as any;
    return {
      meta,
      id,
      windowCsrf: w.csrf,
      windowTildaCsrf: w.tildaCsrf,
      csrfInScriptsCount: csrfInScripts.length,
      firstCsrfScript: csrfInScripts[0]?.slice(0, 300),
    };
  });

  console.log('\nDOM Evaluation:');
  console.log(JSON.stringify(domInfo, null, 2));

  // Now, try adding a block in the browser!
  console.log('\nLooking for Add Block button in DOM...');
  const addBtn = await page.$('.tp-record-new, .tp-btn-add, .tp-btn, [data-hook="add-block"]');
  if (addBtn) {
    console.log('Found add button! Clicking...');
    await addBtn.click();
    await page.waitForTimeout(2000);
  } else {
    console.log('No direct add button found, searching all clickable elements in allrecords...');
    const recs = await page.$('#allrecords');
    console.log('allrecords element:', recs ? 'found' : 'not found');
  }

  await browser.screenshot({ path: 'storage/editor-ru-live.png' });
  console.log('Screenshot saved to storage/editor-ru-live.png');

  await browser.close();
}

capture().catch(console.error);
