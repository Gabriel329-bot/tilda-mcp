import { chromium } from 'playwright';

async function testLive() {
  const liveUrl = 'https://polish-clumsy-carp.tilda.ws/page258776909.html';
  console.log(`🌐 Запуск верификации опубликованной страницы: ${liveUrl}`);

  const browser = await chromium.launch({ headless: true });

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
    const res = await page.goto(liveUrl, { waitUntil: 'networkidle', timeout: 30000 });

    console.log(`\n📱 Вьюпорт: ${vp.name} (HTTP ${res?.status()})`);

    // Check zero horizontal overflow
    const overflow = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      return { scrollWidth, innerWidth, hasOverflow: scrollWidth > innerWidth };
    });

    console.log(`   scrollWidth: ${overflow.scrollWidth}px, innerWidth: ${overflow.innerWidth}px`);
    if (overflow.hasOverflow) {
      console.error(`   ❌ ОБНАРУЖЕН ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ!`);
      process.exit(1);
    } else {
      console.log(`   ✅ Идеально: горизонтальный скролл отсутствует (0 overflow).`);
    }

    // Check critical elements visibility
    const h1 = await page.locator('h1').textContent();
    console.log(`   H1: "${h1?.trim().slice(0, 60)}..."`);

    // Check Lot Catalog cards
    const lotCards = await page.locator('.lot-card').count();
    console.log(`   Карточек в каталоге: ${lotCards}`);

    // Check Facade switch
    const nightBtn = page.locator('#btn-facade-night');
    if (await nightBtn.count() > 0) {
      await nightBtn.click();
      await page.waitForTimeout(800);
      const nightOpacity = await page.locator('#facade-night').evaluate((el) => window.getComputedStyle(el).opacity);
      console.log(`   🌙 Переключатель фасада (Сумерки): opacity = ${nightOpacity}`);
    }

    // Check Mortgage calculation
    const payment = await page.locator('#calc-result-monthly').textContent();
    console.log(`   🧮 Ипотечный расчет по умолчанию: ${payment?.trim()}`);

    await context.close();
  }

  await browser.close();
  console.log('\n🎉 Верификация боевой опубликованной страницы успешно завершена!');
}

testLive().catch((err) => {
  console.error('❌ Ошибка верификации боевой страницы:', err);
  process.exit(1);
});
