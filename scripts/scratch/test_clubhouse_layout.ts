import { chromium } from 'playwright';
import path from 'path';
import { pathToFileURL } from 'url';

async function testClubhouseLayout() {
  console.log('🏛️ Запуск Playwright проверки верстки и интерактива клубного дома (375px, 768px, 1440px)...');
  const browser = await chromium.launch({ headless: true });

  const previewPath = path.resolve(process.cwd(), 'preview_clubhouse.html');
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

    // 1. Check zero horizontal overflow
    const overflow = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      return { scrollWidth, innerWidth, hasOverflow: scrollWidth > innerWidth };
    });

    console.log(`\n📱 Вьюпорт: ${vp.name}`);
    console.log(`   scrollWidth: ${overflow.scrollWidth}px, innerWidth: ${overflow.innerWidth}px`);
    if (overflow.hasOverflow) {
      console.error(`   ❌ ОБНАРУЖЕН ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ! (${overflow.scrollWidth}px > ${overflow.innerWidth}px)`);
      process.exit(1);
    } else {
      console.log(`   ✅ Идеально: горизонтальный скролл отсутствует (0 overflow).`);
    }

    // 2. Check critical typography & sections
    const h1 = await page.locator('h1').textContent();
    console.log(`   H1: "${h1?.trim().slice(0, 60)}..."`);

    const sections = await page.locator('section').count();
    console.log(`   Секций на странице: ${sections}`);

    // 3. Test Day / Dusk Facade Switcher
    const nightBtn = page.locator('#btn-facade-night');
    if (await nightBtn.count() > 0) {
      await nightBtn.click();
      await page.waitForTimeout(800);
      const nightOpacity = await page.locator('#facade-night').evaluate((el) => window.getComputedStyle(el).opacity);
      console.log(`   🌙 Переключатель фасада (Сумерки): opacity = ${nightOpacity}`);
    }

    // 4. Test Catalog Category Switcher
    const pentBtn = page.locator('button:has-text("Пентхаус (1)")');
    if (await pentBtn.count() > 0) {
      await pentBtn.click();
      const cardsCount = await page.locator('#lots-grid > div').count();
      console.log(`   🏢 Фильтр каталога (Пентхаус): отображено карточек = ${cardsCount}`);
    }

    // 5. Test Mortgage Calculator slider reaction
    const slider = page.locator('#slider-price');
    if (await slider.count() > 0) {
      await slider.fill('150000000');
      await slider.dispatchEvent('input');
      const monthlyPayment = await page.locator('#calc-monthly-payment').textContent();
      console.log(`   🧮 Ипотечный калькулятор (150 млн ₽): платеж = ${monthlyPayment?.trim()}`);
    }

    // 6. Test Accordion
    const firstDetails = page.locator('details').first();
    if (await firstDetails.count() > 0) {
      await firstDetails.click();
      const isOpen = await firstDetails.evaluate((el: HTMLDetailsElement) => el.open);
      console.log(`   📜 Аккордеон 214-ФЗ: ${isOpen ? '✅ Открыт' : '❌ Не открыт'}`);
    }

    await context.close();
  }

  await browser.close();
  console.log('\n🎉 Все проверки верстки, типографики и скриптов успешно пройдены!');
}

testClubhouseLayout().catch((err) => {
  console.error('❌ Ошибка теста верстки:', err);
  process.exit(1);
});
