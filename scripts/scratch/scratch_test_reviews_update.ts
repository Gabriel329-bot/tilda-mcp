import { TildaHttpClient } from '../../src/client/tilda-http-client.js';

async function testReviewsUpdate() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  const pageId = '253932009';
  const rec533 = '4045390101';

  const reviews = [
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
  ];

  console.log('Updating 533...');
  const res = await client.updateBlock(pageId, rec533, {
    btitle: 'ОТЗЫВЫ ВЛАДЕЛЬЦЕВ',
    bdescr: 'Реальные впечатления клиентов после визита в закрытый бокс APEX PERFORMANCE',
    rec_anchor: 'reviews',
    colormode: 'dark',
    theme: 'dark',
    style_preset: 'dark',
    bg_color: '#0F1117',
    title_color: '#FFFFFF',
    descr_color: '#94A3B8',
    list: reviews,
  });
  console.log('Update result:', res);

  const records = await client.getPageRecords(pageId);
  const r = records.find(x => x.id === rec533 || (x.html && x.html.includes(rec533)));
  const html = r?.html || '';
  console.log('Includes Алексей Смирнов:', html.includes('Алексей Смирнов'));
  console.log('Includes Porsche 911 GT3 RS:', html.includes('Porsche 911 GT3 RS'));
  console.log('Includes reviews anchor:', html.includes('data-anchor="reviews"'));
}

testReviewsUpdate().catch(console.error);
