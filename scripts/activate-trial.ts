import { chromium } from 'playwright';

async function checkTrial() {
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
    const win = window as any;
    if (typeof win.tp__library__open === 'function') win.tp__library__open();
  });
  await page.waitForTimeout(500);

  // Click "Другое"
  await page.evaluate(() => {
    const types = Array.from(document.querySelectorAll('.tp-library__type')) as HTMLElement[];
    const other = types.find((el) => (el.textContent || '').includes('Другое'));
    if (other) other.click();
  });
  await page.waitForTimeout(800);

  // Click T123
  await page.evaluate(() => {
    const bodies = Array.from(document.querySelectorAll('.tp-library__tpl-body')) as HTMLElement[];
    const htmlCard = bodies.find((b) => (b.textContent || '').includes('HTML'));
    if (htmlCard) htmlCard.click();
  });
  await page.waitForTimeout(1000);

  const trialBtn = await page.$('a:has-text("Активировать пробный период"), button:has-text("Активировать пробный период")');
  console.log('Trial button present:', trialBtn !== null);

  if (trialBtn) {
    const href = await trialBtn.getAttribute('href');
    const tagName = await trialBtn.evaluate((el) => el.tagName);
    console.log('Trial button tagName:', tagName, 'href:', href);

    console.log('Clicking "Активировать пробный период"...');
    await trialBtn.click();
    await page.waitForTimeout(3000);

    console.log('Page URL after click:', page.url());
    console.log('Page Title:', await page.title());

    await page.screenshot({ path: 'D:/TildaMCP/storage/after-trial-click.png' });
    console.log('Screenshot saved to after-trial-click.png');
  }

  await browser.close();
}

checkTrial().catch(console.error);
