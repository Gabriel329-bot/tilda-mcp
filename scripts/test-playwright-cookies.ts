import { chromium } from 'playwright';

async function test() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
  });

  const context = await browser.newContext();
  await context.addCookies([
    {
      name: 'registered',
      value: 'yes',
      domain: '.tilda.cc',
      path: '/',
    },
    {
      name: 'deviceid',
      value: '3VaHrt',
      domain: '.tilda.cc',
      path: '/',
    },
    {
      name: 'mainsite',
      value: 'tilda.cc',
      domain: '.tilda.cc',
      path: '/',
    },
    {
      name: 'PHPSESSID',
      value: 'cs8mi4c2n3sucnghbrjdo90dcj',
      domain: '.tilda.cc',
      path: '/',
    },
    {
      name: 'userid',
      value: '37237203',
      domain: '.tilda.cc',
      path: '/',
    },
    {
      name: 'hash',
      value: 'b3926d918b8870f63bd6eab8771aa495',
      domain: '.tilda.cc',
      path: '/',
    },
    {
      name: 'lang',
      value: 'RU',
      domain: '.tilda.cc',
      path: '/',
    },
  ]);

  const page = await context.newPage();
  console.log('Navigating to https://tilda.cc/projects/...');
  const resp = await page.goto('https://tilda.cc/projects/');
  console.log('Final URL:', page.url());
  console.log('Status:', resp?.status());
  console.log('Title:', await page.title());

  const cookiesAfter = await context.cookies();
  console.log('Cookies after navigation:', cookiesAfter.map(c => `${c.name}=${c.value.slice(0, 8)}...`));

  await browser.close();
}

test().catch(console.error);
