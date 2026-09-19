import { chromium } from 'playwright';

async function inspectChildren() {
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
  await page.waitForTimeout(500);

  // Click on "Другое"
  await page.evaluate(() => {
    const types = Array.from(document.querySelectorAll('.tp-library__type')) as HTMLElement[];
    const other = types.find((el) => (el.textContent || '').includes('Другое'));
    if (other) other.click();
  });
  await page.waitForTimeout(1000);

  const domStructure = await page.evaluate(() => {
    const lib = document.querySelector('.tp-library');
    if (!lib) return 'no lib';
    const report: any[] = [];
    lib.querySelectorAll('div').forEach((d) => {
      if (d.className && d.className.trim()) {
        report.push({
          class: d.className,
          id: d.id,
          dataCod: d.getAttribute('data-cod'),
          dataTpl: d.getAttribute('data-tpl'),
          dataTplId: d.getAttribute('data-tpl-id'),
        });
      }
    });
    return report;
  });

  console.log('DOM elements with data-tpl or classes:');
  const tpls = domStructure.filter((d) => d.dataTpl || d.dataCod || d.dataTplId || d.class.includes('tpl') || d.class.includes('card'));
  console.log(JSON.stringify(tpls.slice(0, 30), null, 2));

  await browser.close();
}

inspectChildren().catch(console.error);
