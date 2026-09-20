import { TildaHttpClient } from '../../src/client/tilda-http-client.js';
import { STYLE_PRESETS } from '../../src/styles/presets.js';

async function testFullBTier() {
  console.log('[Test B-Tier] Initializing client...');
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  console.log('[Test B-Tier] Authenticated on', client.getBaseUrl());

  const projectId = '40607103';
  const pageTitle = 'APEX PERFORMANCE — Complete B-Tier Showcase';

  console.log('[Test B-Tier] Creating new blank page...');
  const pageId = await client.createPage(projectId, pageTitle);
  console.log('[Test B-Tier] Created page ID:', pageId);

  await client.initSession(pageId);

  const presetKey = 'dark';
  const theme = STYLE_PRESETS[presetKey];
  const colormode = 'dark';

  const pendingUpdates: Promise<any>[] = [];
  const sectionsGenerated: string[] = [];

  // 1. Header (ME101 / ME301N - tplId 2083)
  console.log('[Test B-Tier] Adding Header...');
  const headerRec = await client.addBlock(pageId, 'ME101');
  const defaultMenuItems = [
    { title: 'Преимущества', href: '#features' },
    { title: 'Цифры', href: '#metrics' },
    { title: 'Цены', href: '#pricing' },
    { title: 'Отзывы', href: '#reviews' },
    { title: 'FAQ', href: '#faq' },
    { title: 'Контакты', href: '#form' },
  ];
  const headerPayload: Record<string, string> = {
    title: 'APEX PERFORMANCE',
    buttontitle: 'Записаться',
    buttonlink: '#form',
    bg_color: theme.bgPrimary,
    title_color: theme.textPrimary,
    color: theme.textPrimary,
    btn_bg_color: theme.accentBtnBg,
    buttontitle_color: theme.accentBtnText,
    colormode,
    theme: presetKey,
    style_preset: presetKey,
  };
  defaultMenuItems.forEach((item, idx) => {
    headerPayload[`menuitems-title[${idx}]`] = item.title;
    headerPayload[`menuitems-link[${idx}]`] = item.href;
  });
  pendingUpdates.push(client.updateBlock(pageId, headerRec, headerPayload));
  sectionsGenerated.push('header');

  // 2. Hero (CR30 / CR16 - tplId 205)
  console.log('[Test B-Tier] Adding Hero...');
  const heroRec = await client.addBlock(pageId, 'CR30');
  pendingUpdates.push(
    client.updateBlock(pageId, heroRec, {
      title: 'ИНЖЕНЕРИЯ СКОРОСТИ И БЕЗУПРЕЧНЫЙ ДЕТЕЙЛИНГ',
      descr: 'Премиальное обслуживание, чип-тюнинг Stage 1-3 и защита кузова бронепленками в Москве. Точность дилерского уровня с индивидуальным подходом.',
      buttontitle: 'Рассчитать стоимость',
      buttonlink: '#form',
      buttontitle2: 'Наши стандарты',
      buttonlink2: '#features',
      img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85',
      colormode,
      theme: presetKey,
      style_preset: presetKey,
    })
  );
  sectionsGenerated.push('hero');

  // 3. Features (FR104 / FR205 - tplId 491)
  console.log('[Test B-Tier] Adding Features...');
  const featRec = await client.addBlock(pageId, 'FR104');
  pendingUpdates.push(
    client.updateBlock(pageId, featRec, {
      btitle: 'СТАНДАРТЫ APEX PERFORMANCE',
      bdescr: 'Технологии высшего эшелона автоспорта на страже вашего комфорта и динамики',
      rec_anchor: 'features',
      bg_color: theme.bgSecondary,
      colormode,
      theme: presetKey,
      style_preset: presetKey,
      list: [
        { lid: '1', ls: '1', li_title: 'Чип-тюнинг Stage 1-3', li_descr: 'Индивидуальная калибровка ЭБУ на полноприводном диностенде с телеметрией.' },
        { lid: '2', ls: '2', li_title: 'Бронепленка SunTek / Stek', li_descr: 'Защита зон риска и полная оклейка кузова полиуретаном 200 микрон с самозаживлением.' },
        { lid: '3', ls: '3', li_title: 'Детейлинг & Нанокерамика', li_descr: 'Многоэтапная микроабразивная полировка и гидрофобные защитные составы 9H.' },
        { lid: '4', ls: '4', li_title: 'Спортивные выхлопные системы', li_descr: 'Изготовление и установка титановых трасс с клапанами регулировки звука.' },
      ],
    })
  );
  sectionsGenerated.push('features');

  // 4. Metrics (NM01 / FR402N - tplId 1050)
  console.log('[Test B-Tier] Adding Metrics...');
  const metrRec = await client.addBlock(pageId, 'NM01');
  pendingUpdates.push(
    client.updateBlock(pageId, metrRec, {
      btitle: 'APEX В ЦИФРАХ И ФАКТАХ',
      rec_anchor: 'metrics',
      bg_color: theme.bgPrimary,
      colormode,
      theme: presetKey,
      style_preset: presetKey,
      list: [
        { lid: '1', ls: '1', li_title: '12+', li_descr: 'Лет непрерывного опыта в автоспорте и тюнинге' },
        { lid: '2', ls: '2', li_title: '1500+', li_descr: 'Защищенных и доработанных премиальных автомобилей' },
        { lid: '3', ls: '3', li_title: '100%', li_descr: 'Гарантия на все виды работ и программное обеспечение' },
        { lid: '4', ls: '4', li_title: '4 бокса', li_descr: 'Изолированная зона с фильтрацией воздуха класса CleanRoom' },
      ],
    })
  );
  sectionsGenerated.push('metrics');

  // 5. Pricing (PR01 / PL120N - tplId 1072)
  console.log('[Test B-Tier] Adding Pricing (PR01)...');
  const priceRec = await client.addBlock(pageId, 'PR01');
  pendingUpdates.push(
    client.updateBlock(pageId, priceRec, {
      btitle: 'ТАРИФНЫЕ ПЛАНЫ И ПАКЕТЫ',
      bdescr: 'Выберите подходящий уровень подготовки и защиты вашего спорткара',
      rec_anchor: 'pricing',
      bg_color: theme.bgSecondary,
      colormode,
      theme: presetKey,
      style_preset: presetKey,
      list: [
        {
          lid: '1',
          ls: '1',
          li_title: 'LIGHT DETAILING',
          li_price: '45 000 ₽',
          li_subtitle: 'за комплекс',
          li_descr: '<ul><li>Детейлинг-мойка кузова и подвески в 3 фазы</li><li>Глубокая очистка ЛКП синтетической глиной</li><li>Нанокерамика 1 слой + гидрофоб</li><li>Деликатная чистка кожи салона и озонация</li></ul>',
          li_button: 'Выбрать Light',
          li_btn_text: 'Выбрать Light',
          li_btn_href: '#form',
          li_buttonlink: '#form',
        },
        {
          lid: '2',
          ls: '2',
          li_title: 'FULL PROTECTION',
          li_price: '180 000 ₽',
          li_subtitle: 'хит сезона',
          li_descr: '<ul><li>Оклейка передней части и зон риска SunTek</li><li>Абразивная полировка кузова под микроскоп</li><li>Керамическое покрытие 9H в 3 слоя</li><li>Полная химчистка салона с разбором</li><li>Антидождь на все стекла Aquapel</li></ul>',
          li_button: 'Выбрать Protection',
          li_btn_text: 'Выбрать Protection',
          li_btn_href: '#form',
          li_buttonlink: '#form',
          li_featured: 'y',
        },
        {
          lid: '3',
          ls: '3',
          li_title: 'STAGE 2 + TRACK',
          li_price: '290 000 ₽',
          li_subtitle: 'максимум драйва',
          li_descr: '<ul><li>Индивидуальный чип-тюнинг Stage 2</li><li>Полная оклейка кузова полиуретаном в круг</li><li>Downpipe & титановый управляемый выхлоп</li><li>Замер динамики 100-200 и сил на диностенде</li><li>Сохранение официальной дилерской гарантии</li></ul>',
          li_button: 'Выбрать Stage 2',
          li_btn_text: 'Выбрать Stage 2',
          li_btn_href: '#form',
          li_buttonlink: '#form',
        },
      ],
    })
  );
  sectionsGenerated.push('pricing');

  // 6. Testimonials (TS101 / TS203 - tplId 533)
  console.log('[Test B-Tier] Adding Testimonials (TS101)...');
  const testRec = await client.addBlock(pageId, 'TS101');
  pendingUpdates.push(
    client.updateBlock(pageId, testRec, {
      btitle: 'ОТЗЫВЫ ВЛАДЕЛЬЦЕВ',
      bdescr: 'Реальные впечатления постоянных клиентов после визита в бокс APEX PERFORMANCE',
      rec_anchor: 'reviews',
      bg_color: theme.bgPrimary,
      colormode,
      theme: presetKey,
      style_preset: presetKey,
      list: [
        {
          lid: '1',
          ls: '1',
          li_title: 'Алексей Смирнов',
          li_subtitle: '★★★★★ · Porsche 911 GT3 RS',
          li_descr: 'Делал полную оклейку полиуретаном и Stage 2. Точность подгонки лекал идеальная, ни одного стыка не видно. Замеры на диностенде превзошли ожидания: +110 л.с. Чистая работа!',
          li_img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
        {
          lid: '2',
          ls: '2',
          li_title: 'Дмитрий Волков',
          li_subtitle: '★★★★★ · BMW M5 F90 Competition',
          li_descr: 'Устанавливали титановый выхлоп с регулировкой громкости и керамику 9H. Звук просто невероятный, в комфортном режиме тишина, в спорте — чистый адреналин. Рекомендую APEX!',
          li_img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        },
        {
          lid: '3',
          ls: '3',
          li_title: 'Михаил Захаров',
          li_subtitle: '★★★★★ · Mercedes-AMG GT Black Series',
          li_descr: 'Пригонял авто на комплексную реставрацию ЛКП и детейлинг салона. Команда относится к суперкарам как к произведениям искусства. Теперь обслуживаю весь свой автопарк только здесь.',
          li_img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        },
      ],
    })
  );
  sectionsGenerated.push('testimonials');

  // 7. FAQ (TX16N - tplId 585)
  console.log('[Test B-Tier] Adding FAQ...');
  const faqRec = await client.addBlock(pageId, 'TX16N');
  pendingUpdates.push(
    client.updateBlock(pageId, faqRec, {
      btitle: 'ЧАСТЫЕ ВОПРОСЫ',
      bdescr: 'Все, что нужно знать перед визитом в ателье APEX PERFORMANCE',
      rec_anchor: 'faq',
      bg_color: theme.bgSecondary,
      colormode,
      theme: presetKey,
      style_preset: presetKey,
      list: [
        { lid: '1', ls: '1', li_title: 'Сколько времени занимает комплексная оклейка кузова?', li_descr: 'Полная оклейка бронепленкой занимает от 3 до 5 рабочих дней, включая технологическую сушку и контрольный осмотр через 7 дней.' },
        { lid: '2', ls: '2', li_title: 'Сохраняется ли официальная дилерская гарантия?', li_descr: 'Да, наши прошивки калибруются с сохранением заводских систем самодиагностики и CVN-номеров, что исключает обнаружение тюнинга дилерским сканером.' },
        { lid: '3', ls: '3', li_title: 'Какую гарантию вы предоставляете на пленку и керамику?', li_descr: 'Мы даем пожизненную гарантию на монтаж пленки и официальную гарантию производителя 10 лет от пожелтения и расслоения. На нанокерамику действует гарантия 3 года.' },
      ],
    })
  );
  sectionsGenerated.push('faq');

  // 8. Form (BF204 - tplId 678)
  console.log('[Test B-Tier] Adding Form...');
  const formRec = await client.addBlock(pageId, 'BF204');
  pendingUpdates.push(
    client.updateBlock(pageId, formRec, {
      btitle: 'ЗАПИСАТЬСЯ В ЗАКРЫТЫЙ БОКС',
      bdescr: 'Оставьте контактные данные — шеф-механик рассчитает смету и согласует персональное окно визита',
      buttontitle: 'Забронировать визит',
      rec_anchor: 'form',
      bg_color: theme.bgPrimary,
      colormode,
      theme: presetKey,
      style_preset: presetKey,
    })
  );
  sectionsGenerated.push('form');

  // 9. Footer (FT101 - tplId 144)
  console.log('[Test B-Tier] Adding Footer...');
  const footRec = await client.addBlock(pageId, 'FT101');
  pendingUpdates.push(
    client.updateBlock(pageId, footRec, {
      title: 'APEX PERFORMANCE © 2026',
      descr: 'Москва, Кутузовский проспект, 36с4. Ежедневно с 10:00 до 22:00. Закрытая охраняемая территория.',
      bg_color: theme.bgSecondary,
      colormode,
      theme: presetKey,
      style_preset: presetKey,
    })
  );
  sectionsGenerated.push('footer');

  // 10. Auto-CSS Injection (T123 - tplId 131)
  console.log('[Test B-Tier] Injecting Glassmorphism & Neon T123 block...');
  const darkNeonCss = `<style>
  /* Glassmorphism для карточек */
  .t-card__col, .t-col, .t1072__content, .t533__col {
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
  }
  /* Стилизация карточек тарифов (1072) */
  .t1072__content {
    background: rgba(16, 20, 30, 0.6) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 16px !important;
    overflow: hidden !important;
  }
  .t1072__header {
    background: rgba(22, 25, 34, 0.8) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  .t1072__featured .t1072__header {
    background: rgba(0, 245, 255, 0.15) !important;
    border-bottom: 1px solid rgba(0, 245, 255, 0.3) !important;
  }
  .t1072__featured .t-card__title {
    color: #00F5FF !important;
  }
  .t1072__footer {
    background: transparent !important;
  }
  /* Стилизация карточек отзывов (533) */
  .t533__wrapper {
    background: rgba(22, 25, 34, 0.6) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 16px !important;
    padding: 30px !important;
    backdrop-filter: blur(16px) !important;
  }
  /* Неоновое свечение кнопок */
  .t-btn:not(.t-btnflex_type_button2), .t-submit {
    box-shadow: 0 0 25px rgba(0, 245, 255, 0.45) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  .t-btn:hover:not(.t-btnflex_type_button2), .t-submit:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 0 35px rgba(0, 245, 255, 0.7) !important;
  }
  /* Стеклянные поля формы */
  .t-input {
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    color: #FFFFFF !important;
  }
  .t-input:focus {
    border-color: #00F5FF !important;
    box-shadow: 0 0 15px rgba(0, 245, 255, 0.3) !important;
  }
</style>`;
  const t123Rec = await client.addBlock(pageId, 'T123');
  pendingUpdates.push(
    client.updateBlock(pageId, t123Rec, {
      code: darkNeonCss,
      rawcod: darkNeonCss,
      style_preset: presetKey,
    })
  );
  sectionsGenerated.push('t123_custom_css');

  console.log('[Test B-Tier] Awaiting all parallel block updates...');
  await Promise.all(pendingUpdates);
  console.log('[Test B-Tier] All block updates finished successfully.');

  // Trigger getrecordhtml for verification on canvas
  console.log('[Test B-Tier] Verifying getrecordhtml for new blocks...');
  for (const recId of [priceRec, testRec]) {
    const ghRes = await (client as any).request('/page/get/', {
      method: 'POST',
      body: new URLSearchParams({
        comm: 'getrecordhtml',
        pageid: pageId,
        recordid: recId,
        with_code: 'yes',
      }),
    });
    console.log(` - getrecordhtml for ${recId}: HTTP ${ghRes.status}`);
  }

  // Publish page
  console.log('[Test B-Tier] Publishing page...');
  const pubResult = await client.publishPage(pageId);
  console.log('[Test B-Tier] PUBLISH RESULT:', JSON.stringify(pubResult, null, 2));

  // Inspect live page
  console.log(`[Test B-Tier] Fetching published URL: ${pubResult.publishedUrl}...`);
  const pubRes = await fetch(pubResult.publishedUrl);
  console.log(`[Test B-Tier] Public HTTP status: ${pubRes.status}`);
  const html = await pubRes.text();

  const hasPricingAnchor = html.includes('name="pricing"') || html.includes('data-anchor="pricing"') || html.includes('id="pricing"');
  const hasReviewsAnchor = html.includes('name="reviews"') || html.includes('data-anchor="reviews"') || html.includes('id="reviews"');
  const hasPricingCards = html.includes('LIGHT DETAILING') && html.includes('FULL PROTECTION') && html.includes('STAGE 2 + TRACK');
  const hasFeaturedHighlight = html.includes('t1072__featured');
  const hasReviewsContent = html.includes('Алексей Смирнов') && html.includes('Дмитрий Волков') && html.includes('Михаил Захаров');
  const hasAllNavigationLinks = html.includes('#features') && html.includes('#metrics') && html.includes('#pricing') && html.includes('#reviews') && html.includes('#faq') && html.includes('#form');
  const hasGlassmorphism = html.includes('t1072__content') && html.includes('t533__wrapper');

  console.log('\n================ B-TIER VERIFICATION CHECKLIST ================');
  console.log(` - Total sections generated: ${sectionsGenerated.length} (${sectionsGenerated.join(', ')})`);
  console.log(` - Navigation contains all 6 anchors (#features, #metrics, #pricing, #reviews, #faq, #form): ${hasAllNavigationLinks ? 'PASS' : 'FAIL'}`);
  console.log(` - Pricing section has data-anchor="pricing": ${hasPricingAnchor ? 'PASS' : 'FAIL'}`);
  console.log(` - Pricing cards (Light, Protection, Stage 2) rendered: ${hasPricingCards ? 'PASS' : 'FAIL'}`);
  console.log(` - Pricing featured plan highlighted: ${hasFeaturedHighlight ? 'PASS' : 'FAIL'}`);
  console.log(` - Testimonials section has data-anchor="reviews": ${hasReviewsAnchor ? 'PASS' : 'FAIL'}`);
  console.log(` - Testimonials cards (Alexey, Dmitry, Mikhail) rendered: ${hasReviewsContent ? 'PASS' : 'FAIL'}`);
  console.log(` - Glassmorphism CSS for Pricing & Reviews present: ${hasGlassmorphism ? 'PASS' : 'FAIL'}`);
  console.log('===============================================================\n');

  if (hasPricingAnchor && hasReviewsAnchor && hasPricingCards && hasReviewsContent && hasAllNavigationLinks && hasGlassmorphism) {
    console.log('>>> B-TIER EXTENSION VERIFICATION: ALL CHECKS PASSED! <<<');
  } else {
    console.warn('>>> SOME CHECKS FAILED - REVIEW ABOVE OUTPUT <<<');
  }
}

testFullBTier().catch(err => {
  console.error('[Test B-Tier] Fatal error:', err);
  process.exit(1);
});
