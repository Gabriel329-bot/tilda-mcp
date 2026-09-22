import { chromium } from 'playwright';
import path from 'path';
import { pathToFileURL } from 'url';

async function diagnose() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  const previewPath = path.resolve(process.cwd(), 'preview_clubhouse.html');
  await page.goto(pathToFileURL(previewPath).href, { waitUntil: 'networkidle' });

  const offenders = await page.evaluate(() => {
    const results: any[] = [];
    const all = document.querySelectorAll('*');
    for (const el of Array.from(all)) {
      const rect = el.getBoundingClientRect();
      if (rect.right > 375.5) {
        results.push({
          tag: el.tagName,
          id: el.id || '',
          className: (el.className || '').toString().slice(0, 100),
          rectRight: Math.round(rect.right),
          rectWidth: Math.round(rect.width),
          parentTag: el.parentElement ? el.parentElement.tagName : '',
          parentId: el.parentElement ? el.parentElement.id : '',
        });
      }
    }
    return results;
  });

  console.log('Total overflowing elements:', offenders.length);
  // Show the outermost offenders
  const topOffenders = offenders.slice(0, 20);
  console.log(JSON.stringify(topOffenders, null, 2));

  await browser.close();
}

diagnose().catch(console.error);
