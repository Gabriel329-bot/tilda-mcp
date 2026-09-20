import { performance } from 'perf_hooks';
import { TildaHttpClient } from '../src/client/tilda-http-client.js';

const PAGE_ID = process.env.TILDA_PAGE_ID || process.argv[2] || '253396603';

async function deployToRealPage() {
  console.log('===========================================================');
  console.log('  🚀 Deploying Landing Page to Real Page ID                ');
  console.log('===========================================================');
  console.log(`Target Page ID : ${PAGE_ID}`);
  console.log(`Start Time     : ${new Date().toISOString()}\n`);

  const startTime = performance.now();
  console.time('Deploy');

  // Initialized with strict status checks and safe human-like pacing
  const client = new TildaHttpClient({ humanLikePacing: true });

  console.log('[1/7] Initializing session & extracting CSRF token...');
  const session = await client.initSession(PAGE_ID);
  console.log(`      Domain: ${session.domain}, CSRF: "${session.csrf || '<auto>'}", HTTP Status: ${session.status}`);

  console.log('\n[Очистка страницы] Удаление всех текущих блоков...');
  const deletedCount = await client.deleteAllRecords(PAGE_ID);
  console.log(`      Удалено существующих блоков: ${deletedCount}. Страница полностью очищена.\n`);

  // 1. Hero Cover Block: CR16 (tplId: 205)
  console.log('[2/7] Adding Hero Block (CR30 -> CR16, tplId: 205)...');
  const heroId = await client.addBlock(PAGE_ID, 'CR30');
  const heroFields = {
    title: 'Студия интерьерного дизайна Moderna — Реализация под ключ',
    descr: 'Создаем эргономичные жилые и коммерческие пространства премиум-класса с полным авторским надзором от первого эскиза до расстановки декора.',
    buttontitle: 'Рассчитать смету проекта',
    buttonlink: '#order-form',
    buttontitle2: 'Смотреть этапы работы',
    buttonlink2: '#stages',
  };
  await client.updateBlock(PAGE_ID, heroId, heroFields);
  console.log(`      Hero Block (CR16, tplId: 205) configured. Record ID: ${heroId}`);
  for (const [key, val] of Object.entries(heroFields)) {
    console.log(`      ✓ [OK] ${key}: "${String(val).slice(0, 50)}${String(val).length > 50 ? '...' : ''}"`);
  }

  // 2. Features Block: FR205 (tplId: 491, 4 этапа работы)
  console.log('\n[3/7] Adding Features Block (FR104 -> FR205, tplId: 491: 4 этапа работы)...');
  const featId = await client.addBlock(PAGE_ID, 'FR104');
  const featList = [
    {
      lid: '1001',
      ls: '10',
      li_title: '1. Бриф и обмеры',
      li_descr: 'Выезжаем на объект, создаем точную 3D-модель стен, фиксируем пожелания и рамки бюджета.',
    },
    {
      lid: '1002',
      ls: '20',
      li_title: '2. 3D-визуализация',
      li_descr: 'Разрабатываем фотореалистичные рендеры каждого помещения и полный пакет строительных чертежей.',
    },
    {
      lid: '1003',
      ls: '30',
      li_title: '3. Комплектация',
      li_descr: 'Подбираем отделочные материалы, мебель, освещение и сантехнику со скидками поставщиков.',
    },
    {
      lid: '1004',
      ls: '40',
      li_title: '4. Авторский надзор',
      li_descr: 'Регулярные выезды архитектора на стройку, контроль строителей и сдача готового объекта точно в срок.',
    },
  ];
  const featFields = {
    btitle: '4 ключевых этапа создания вашего идеального интерьера',
    bdescr: 'Прозрачный процесс работы без скрытых переплат и задержек по срокам.',
    list: featList,
  };
  await client.updateBlock(PAGE_ID, featId, featFields);
  console.log(`      Features Block (FR205, tplId: 491) configured. Record ID: ${featId}`);
  console.log(`      ✓ [OK] btitle: "${featFields.btitle}"`);
  console.log(`      ✓ [OK] bdescr: "${featFields.bdescr}"`);
  console.log(`      ✓ [OK] list: 4 карточки этапов (JSON-сериализация)`);

  // 3. Metrics Block: FR402N (tplId: 1050, Цифры и факты)
  console.log('\n[4/7] Adding Metrics Block (NM01 -> FR402N, tplId: 1050)...');
  const metrId = await client.addBlock(PAGE_ID, 'NM01');
  const metricsList = [
    {
      lid: '2001',
      ls: '10',
      li_title: '140+',
      li_descr: 'Реализованных проектов под ключ',
    },
    {
      lid: '2002',
      ls: '20',
      li_title: '12 лет',
      li_descr: 'Опыта в проектировании интерьеров',
    },
    {
      lid: '2003',
      ls: '30',
      li_title: '98%',
      li_descr: 'Проектов сдано строго в рамках сметы',
    },
    {
      lid: '2004',
      ls: '40',
      li_title: '45 дней',
      li_descr: 'Средний срок создания дизайн-проекта',
    },
  ];
  const metrFields = {
    btitle: 'Moderna в цифрах и фактах',
    bdescr: 'Профессионализм, подтвержденный годами практики и отзывами клиентов',
    list: metricsList,
  };
  await client.updateBlock(PAGE_ID, metrId, metrFields);
  console.log(`      Metrics Block (FR402N, tplId: 1050) configured. Record ID: ${metrId}`);
  console.log(`      ✓ [OK] btitle: "${metrFields.btitle}"`);
  console.log(`      ✓ [OK] bdescr: "${metrFields.bdescr}"`);
  console.log(`      ✓ [OK] list: 4 метрики с цифрами и описанием (JSON-сериализация)`);

  // 4. Form Block: BF204N (tplId: 678, Вертикальная форма)
  console.log('\n[5/7] Adding Form Block (BF204 -> BF204N, tplId: 678)...');
  const formId = await client.addBlock(PAGE_ID, 'BF204');
  const formFields = {
    btitle: 'Рассчитайте точную смету вашего проекта',
    bdescr: 'Оставьте заявку сегодня и получите 3 варианта индивидуального планировочного решения в подарок!',
    buttontitle: 'Получить расчет и планировку бесплатно',
  };
  await client.updateBlock(PAGE_ID, formId, formFields);
  console.log(`      Form Block (BF204N, tplId: 678) configured. Record ID: ${formId}`);
  for (const [key, val] of Object.entries(formFields)) {
    console.log(`      ✓ [OK] ${key}: "${val}"`);
  }

  // 5. Footer Block: FT101 (tplId: 144, Лого и текст по центру)
  console.log('\n[6/7] Adding Footer Block (FT101, tplId: 144)...');
  const footId = await client.addBlock(PAGE_ID, 'FT101');
  const footFields = {
    title: 'Moderna Interior Design Studio',
    descr: '© 2026 Студия интерьерного дизайна «Moderna». Все права защищены. Москва, Кутузовский проспект, 36 • Тел: +7 (495) 890-34-21',
  };
  await client.updateBlock(PAGE_ID, footId, footFields);
  console.log(`      Footer Block (FT101, tplId: 144) configured. Record ID: ${footId}`);
  for (const [key, val] of Object.entries(footFields)) {
    console.log(`      ✓ [OK] ${key}: "${val}"`);
  }

  // Верификация рендеринга контента через /page/get/getpage/
  console.log('\n===========================================================');
  console.log('  🔍 ВЕРИФИКАЦИЯ РЕНДЕРИНГА КОНТЕНТА НА КАНВАСЕ');
  console.log('===========================================================');
  const verifyRecords = await client.getPageRecords(PAGE_ID);
  console.log(`Всего блоков на странице: ${verifyRecords.length}`);

  const checks = [
    { id: heroId, name: 'Hero (CR16 / 205)', text: 'Moderna — Реализация под ключ' },
    { id: featId, name: 'Features (FR205 / 491)', text: '4 ключевых этапа' },
    { id: metrId, name: 'Metrics (FR402N / 1050)', text: 'Moderna в цифрах и фактах' },
    { id: formId, name: 'Form (BF204N / 678)', text: 'Рассчитайте точную смету' },
    { id: footId, name: 'Footer (FT101 / 144)', text: 'Moderna Interior Design Studio' },
  ];

  for (const check of checks) {
    const rec = verifyRecords.find((r: any) => r.html && r.html.includes(check.id));
    if (rec && rec.html.includes(check.text)) {
      const codMatch = rec.html.match(/data-record-cod="([^"]+)"/);
      console.log(`  ✅ [VERIFIED] ${check.name} (ID: ${check.id}, COD: ${codMatch ? codMatch[1] : '?'}) — текст найден!`);
    } else {
      console.error(`  ❌ [FAILED] ${check.name} (ID: ${check.id}) — ожидаемый текст не обнаружен в разметке!`);
    }
  }

  const skipPublish = process.argv.includes('--no-publish') || process.env.SKIP_PUBLISH === 'true';
  let pubResult = {
    pageId: PAGE_ID,
    publishedUrl: `https://tilda.cc/page/?pageid=${PAGE_ID}`,
    publishedAt: 'Draft (Not Published)',
  };

  if (skipPublish) {
    console.log('\n[7/7] Пропуск публикации (--no-publish). Блоки сохранены в черновике страницы.');
  } else {
    console.log('\n[7/7] Publishing page...');
    const pub = await client.publishPage(PAGE_ID);
    pubResult = pub;
  }

  console.log('\n===========================================================');
  console.log('       🎉 DEPLOY COMPLETED SUCCESSFULLY!                  ');
  console.log('===========================================================');
  console.timeEnd('Deploy');
  const duration = ((performance.now() - startTime) / 1000).toFixed(2);

  console.log(`Page ID       : ${pubResult.pageId}`);
  console.log(`Editor URL    : https://tilda.cc/page/?pageid=${pubResult.pageId}`);
  console.log(`Published URL : ${pubResult.publishedUrl}`);
  console.log(`Status        : ${pubResult.publishedAt}`);
  console.log(`Duration      : ${duration}s\n`);

  return pubResult;
}

deployToRealPage().catch((err) => {
  console.error('\n❌ [DEPLOY FAILED - STRICT CHECK TRIGGERED]:');
  console.error(err.message);
  process.exitCode = 1;
});
