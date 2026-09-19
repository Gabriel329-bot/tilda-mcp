import { chromium } from 'playwright';
import { STORAGE_STATE_PATH } from '../src/config.js';

async function testAddBlockInBrowser() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: STORAGE_STATE_PATH });
  const page = await context.newPage();

  page.on('request', (req) => {
    console.log(`[REQ] ${req.method()} ${req.url()}`);
    if (req.method() === 'POST') {
      console.log(`      Payload: ${req.postData()}`);
    }
  });

  page.on('response', (res) => {
    if (res.url().includes('tilda') && !res.url().includes('.png') && !res.url().includes('.css')) {
      console.log(`[RES] ${res.status()} ${res.url()}`);
    }
  });

  console.log('Navigating to editor...');
  await page.goto('https://tilda.cc/page/?pageid=253396603', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Take screenshot of editor
  await page.screenshot({ path: 'storage/page_editor_live.png' });
  console.log('Screenshot saved to storage/page_editor_live.png');

  // Let's inspect page HTML or buttons
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a, .tp-btn, .tp-record-new')).map(b => ({
      tag: b.tagName,
      cls: b.className,
      text: b.textContent?.trim().slice(0, 50),
      id: b.id
    }));
  });
  console.log('Buttons found:', buttons.slice(0, 15));

  await browser.close();
}

testAddBlockInBrowser().catch(console.error);
