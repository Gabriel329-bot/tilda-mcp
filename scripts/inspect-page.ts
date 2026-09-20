import { chromium } from 'playwright';

async function checkPage() {
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
  console.log('Navigating to page editor: https://tilda.ru/page/?pageid=30772896');
  await page.goto('https://tilda.ru/page/?pageid=30772896', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  console.log('Page Title:', await page.title());
  console.log('Page URL:', page.url());

  const hasCanvas = (await page.$('#allrecords')) !== null;
  console.log('Editor canvas #allrecords present:', hasCanvas);

  const records = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div.record')).map((el) => ({
      id: el.id,
      recordId: el.getAttribute('data-record-id'),
      tpl: el.getAttribute('data-record-type'),
    }));
  });
  console.log('Records currently on page:', records);

  await page.screenshot({ path: 'D:/TildaMCP/storage/page-editor-30772896.png' });
  console.log('Screenshot saved to D:/TildaMCP/storage/page-editor-30772896.png');

  await browser.close();
}

checkPage().catch(console.error);
