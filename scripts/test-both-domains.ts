import { chromium } from 'playwright';

async function test() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  });

  const context = await browser.newContext();
  
  const baseCookies = [
    { name: 'registered', value: 'yes' },
    { name: 'deviceid', value: '3VaHrt' },
    { name: 'mainsite', value: 'tilda.cc' },
    { name: 'PHPSESSID', value: 'cs8mi4c2n3sucnghbrjdo90dcj' },
    { name: 'userid', value: '37237203' },
    { name: 'hash', value: 'b3926d918b8870f63bd6eab8771aa495' },
    { name: 'lang', value: 'RU' },
  ];

  const allCookies: any[] = [];
  for (const domain of ['.tilda.cc', '.tilda.ru', 'tilda.cc', 'tilda.ru']) {
    for (const c of baseCookies) {
      allCookies.push({
        ...c,
        domain,
        path: '/',
      });
    }
  }

  await context.addCookies(allCookies);

  const page = await context.newPage();
  console.log('Navigating to https://tilda.cc/projects/...');
  try {
    const resp = await page.goto('https://tilda.cc/projects/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('Final URL:', page.url());
    console.log('Status:', resp?.status());
    console.log('Title:', await page.title());
    
    // Check if page 253396603 exists or what pages exist
    const content = await page.content();
    const pageMatches = [...content.matchAll(/pageid=(\d+)/g)].map(m => m[1]);
    console.log('Pages visible in projects:', [...new Set(pageMatches)]);
  } catch (err: any) {
    console.error('Navigation error:', err.message);
  }

  await browser.close();
}

test().catch(console.error);
