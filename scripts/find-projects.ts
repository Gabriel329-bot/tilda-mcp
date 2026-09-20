import { chromium } from 'playwright';

async function listProjects() {
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
  await page.goto('https://tilda.ru/projects/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'D:/TildaMCP/storage/projects-dashboard.png' });

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map((a) => ({ text: a.textContent?.trim().replace(/\s+/g, ' ') || '', href: a.href }))
      .filter((l) => l.href.includes('projectid=') || l.href.includes('/projects/'));
  });

  console.log('Project links found:', JSON.stringify(links, null, 2));

  await browser.close();
}

listProjects().catch(console.error);
