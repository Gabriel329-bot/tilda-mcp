import { chromium } from 'playwright';

async function inspectAddBlock() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox'],
  });

  const context = await browser.newContext({
    storageState: 'D:/TildaMCP/storage/storage_state.json',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();
  await page.goto('https://tilda.ru/page/?pageid=30772896', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Open library
  await page.evaluate(() => {
    (window as any).tp__library__open && (window as any).tp__library__open();
  });
  await page.waitForTimeout(1000);

  // Inspect the right side HTML of the library
  const rightSideHTML = await page.evaluate(() => {
    // Open "Другое"
    const types = Array.from(document.querySelectorAll('.tp-library__type')) as HTMLElement[];
    const other = types.find((el) => (el.textContent || '').includes('Другое'));
    if (other) other.click();

    return new Promise((resolve) => {
      setTimeout(() => {
        const rightside = document.querySelector('.tp-library__rightside, .tp-library__right');
        if (!rightside) {
          resolve('Rightside not found. Available classes: ' + document.querySelector('.tp-library')?.className);
          return;
        }
        // Return first 2000 chars of rightside
        resolve(rightside.innerHTML.slice(0, 3000));
      }, 1000);
    });
  });

  console.log('Rightside HTML preview:\n', rightSideHTML);

  await browser.close();
}

inspectAddBlock().catch(console.error);
