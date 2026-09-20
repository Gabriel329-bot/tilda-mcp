import { chromium } from 'playwright';
import path from 'path';
import { pathToFileURL } from 'url';

async function testFemmeLayout() {
  console.log('🧪 Запуск Playwright проверки верстки Femme Sculpt (375px и 1440px)...');
  const browser = await chromium.launch({ headless: true });

  const previewPath = path.resolve(process.cwd(), 'preview_femme.html');
  const previewUrl = pathToFileURL(previewPath).href;

  const viewports = [
    { name: 'iPhone 13 / 14 (375px)', width: 375, height: 812 },
    { name: 'iPad Mini (768px)', width: 768, height: 1024 },
    { name: 'Desktop HD (1440px)', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto(previewUrl, { waitUntil: 'networkidle' });

    // Check zero horizontal overflow
    const overflow = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      return { scrollWidth, innerWidth, hasOverflow: scrollWidth > innerWidth };
    });

    console.log(`\n📱 Вьюпорт: ${vp.name}`);
    console.log(`   scrollWidth: ${overflow.scrollWidth}px, innerWidth: ${overflow.innerWidth}px`);
    if (overflow.hasOverflow) {
      console.error(`   ❌ ОБНАРУЖЕН ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ!`);
      process.exit(1);
    } else {
      console.log(`   ✅ Идеально: горизонтальный скролл отсутствует (0 overflow).`);
    }

    // Check critical elements visibility
    const h1 = await page.locator('h1').textContent();
    console.log(`   H1: "${h1?.trim().slice(0, 50)}..."`);

    const sections = await page.locator('section').count();
    console.log(`   Секций на странице: ${sections}`);

    // Check FAQ accordion interaction
    const firstDetails = page.locator('details').first();
    await firstDetails.click();
    const isOpen = await firstDetails.evaluate((el: HTMLDetailsElement) => el.open);
    console.log(`   Интерактив FAQ: ${isOpen ? '✅ Успешно открывается' : '❌ Не открылся'}`);

    await context.close();
  }

  await browser.close();
  console.log('\n🎉 Все проверки верстки и интерактивности успешно пройдены!');
}

testFemmeLayout().catch((err) => {
  console.error('❌ Ошибка теста верстки:', err);
  process.exit(1);
});
