import { performance } from 'perf_hooks';
import { TildaHttpClient, BLOCK_TEMPLATES } from '../src/client/tilda-http-client.js';

const PAGE_ID = process.env.TILDA_PAGE_ID || '30772896';

const isFastMode = process.argv.includes('--fast') || process.env.TILDA_FAST_MODE === 'true';

async function fastBuild() {
  console.log('===========================================================');
  console.log(`  🛡️ Tilda HTTP Engine — ${isFastMode ? 'Burst Mode (<3s)' : 'Human-Paced Mode (Anti-Ban 10-12s)'}`);
  console.log('===========================================================');
  console.log(`Target Page ID : ${PAGE_ID}`);
  console.log(`Human Pacing   : ${isFastMode ? 'DISABLED (Max Speed)' : 'ACTIVE (1.5-3.0s Jitter)'}`);
  console.log(`Start Time     : ${new Date().toISOString()}\n`);

  // Start performance timer
  const startTime = performance.now();
  console.time('Full Build');

  const client = new TildaHttpClient({ humanLikePacing: !isFastMode });

  // 1. Initialize session & extract CSRF
  console.log('[1/7] Initializing HTTP session & extracting CSRF token...');
  const session = await client.initSession(PAGE_ID);
  console.log(`      Domain: ${session.domain}, CSRF: "${session.csrf || '<auto>'} ", HTTP Status: ${session.status}`);

  // 2. Block 1: CR30 (Cover with 2 buttons)
  console.log('[2/7] Adding Block CR30 (Hero Cover, tplId: 215)...');
  const cr30Id = await client.addBlock(PAGE_ID, 'CR30');
  const p1 = client.updateBlock(PAGE_ID, cr30Id, {
    title: 'ВкусноЕ Бистро — Честная авторская кухня',
    descr: 'Завтраки целый день, свежий ремесленный хлеб из подовой печи на живой закваске, спешелти-кофе и локальные фермерские продукты.',
    btn_text: 'Забронировать стол',
    btn_href: '#book',
    btn2_text: 'Смотреть меню',
    btn2_href: '#menu',
  }).then(() => console.log(`      CR30 configured. Record ID: ${cr30Id}`));

  // 3. Block 2: FR104 (Features 4 columns)
  console.log('[3/7] Adding Block FR104 (Features 4 cols, tplId: 144)...');
  const fr104Id = await client.addBlock(PAGE_ID, 'FR104');
  const p2 = client.updateBlock(PAGE_ID, fr104Id, {
    title: 'Почему выбирают нас',
    descr: 'Каждый день мы создаем гастрономические впечатления высшего уровня для каждого гостя.',
    title__1: 'Подовая печь',
    descr__1: 'Ремесленный хлеб на живой закваске выпекается каждое утро.',
    title__2: 'Фермерские продукты',
    descr__2: 'Прямые поставки от проверенных локальных хозяйств.',
    title__3: 'All Day Breakfast',
    descr__3: 'Сырники, яйца бенедикт и спешелти-кофе с 8:00 до 23:00.',
    title__4: 'Быстрая отдача',
    descr__4: 'Готовим горячие авторские блюда от 12 минут.',
  }).then(() => console.log(`      FR104 configured. Record ID: ${fr104Id}`));

  // 4. Block 3: NM01 (Metrics / Numbers)
  console.log('[4/7] Adding Block NM01 (Metrics & Numbers, tplId: 140)...');
  const nm01Id = await client.addBlock(PAGE_ID, 'NM01');
  const p3 = client.updateBlock(PAGE_ID, nm01Id, {
    title: 'Цифры говорят сами за себя',
    descr: 'Гарантия стабильного качества и любви к каждому рецепту',
    num__1: '4.9',
    descr__1: 'Рейтинг на Яндекс Картах',
    num__2: '12 мин',
    descr__2: 'Среднее время отдачи блюда',
    num__3: '100%',
    descr__3: 'Натуральные эко-ингредиенты',
    num__4: '15 000+',
    descr__4: 'Счастливых гостей в год',
  }).then(() => console.log(`      NM01 configured. Record ID: ${nm01Id}`));

  // 5. Block 4: BF204 (Contact & Reservation Form)
  console.log('[5/7] Adding Block BF204 (Reservation Form, tplId: 204)...');
  const bf204Id = await client.addBlock(PAGE_ID, 'BF204');
  const p4 = client.updateBlock(PAGE_ID, bf204Id, {
    title: 'Забронируйте столик',
    descr: 'Оставьте контакты и выберите удобное время. При онлайн-бронировании — фирменный десерт в подарок!',
    btn_text: 'Забронировать',
  }).then(() => console.log(`      BF204 configured. Record ID: ${bf204Id}`));

  // 6. Block 5: FT101 (Footer)
  console.log('[6/7] Adding Block FT101 (Footer, tplId: 101)...');
  const ft101Id = await client.addBlock(PAGE_ID, 'FT101');
  const p5 = client.updateBlock(PAGE_ID, ft101Id, {
    title: 'ВкусноЕ Бистро',
    descr: '© 2026 «ВкусноЕ Бистро». Все права защищены. г. Москва, ул. Гастрономическая, д. 12 • Тел: +7 (495) 789-01-23',
  }).then(() => console.log(`      FT101 configured. Record ID: ${ft101Id}`));

  // Await all block field updates to complete before publishing
  await Promise.all([p1, p2, p3, p4, p5]);

  // 7. Publish page
  console.log('[7/7] Publishing page via direct POST /page/publish/...');
  const publishResult = await client.publishPage(PAGE_ID);

  console.log('\n===========================================================');
  console.log('       ⚡ FAST BUILD COMPLETED SUCCESSFULLY!              ');
  console.log('===========================================================');
  console.timeEnd('Full Build');
  const endTime = performance.now();
  const durationSec = ((endTime - startTime) / 1000).toFixed(3);

  console.log(`\nPage ID       : ${publishResult.pageId}`);
  console.log(`Published URL : ${publishResult.publishedUrl}`);
  console.log(`Published At  : ${publishResult.publishedAt}`);
  console.log(`Total Time    : ${durationSec} seconds`);

  if (Number(durationSec) < 3.0) {
    console.log(`🎉 SUCCESS: Target under 3 seconds achieved! (${durationSec}s < 3.000s)`);
  } else {
    console.log(`ℹ️ Completed in ${durationSec}s`);
  }

  return {
    pageId: publishResult.pageId,
    publishedUrl: publishResult.publishedUrl,
    durationSec,
  };
}

fastBuild().catch((err) => {
  console.error('\n❌ [FAST BUILD ERROR]:', err);
  process.exit(1);
});
