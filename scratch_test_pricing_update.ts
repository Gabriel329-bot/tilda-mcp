import { TildaHttpClient } from './src/driver/tilda-http-client.js';

async function testPricingUpdate() {
  const client = new TildaHttpClient({ humanLikePacing: false });
  await client.checkAuth();
  const pageId = '253932009';
  const rec1072 = '4045391601';

  const plans = [
    {
      lid: '1',
      ls: '1',
      li_title: 'LIGHT DETAILING',
      li_price: '45 000 ₽',
      li_subtitle: 'за комплекс',
      li_descr: '<ul><li>Детейлинг-мойка в 3 фазы</li><li>Очистка кузова глиной</li><li>Керамическое покрытие 1 слой</li><li>Уборка салона с озонацией</li></ul>',
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
      li_subtitle: 'популярный выбор',
      li_descr: '<ul><li>Оклейка передней части SunTek</li><li>Полировка кузова под микроскоп</li><li>Керамика 9H в 3 слоя</li><li>Полная химчистка салона</li><li>Антидождь на все стекла</li></ul>',
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
      li_subtitle: 'максимальная мощность',
      li_descr: '<ul><li>Индивидуальная калибровка Stage 2</li><li>Полная оклейка кузова в круг</li><li>Downpipe & регулируемый выхлоп</li><li>Замер мощности на диностенде</li><li>Гарантия дилерского уровня</li></ul>',
      li_button: 'Выбрать Track',
      li_btn_text: 'Выбрать Track',
      li_btn_href: '#form',
      li_buttonlink: '#form',
    },
  ];

  console.log('Updating 1072...');
  const res = await client.updateBlock(pageId, rec1072, {
    btitle: 'ТАРИФНЫЕ ПЛАНЫ И ПАКЕТЫ',
    bdescr: 'Выберите подходящий уровень подготовки и защиты вашего спорткара',
    rec_anchor: 'pricing',
    colormode: 'dark',
    theme: 'dark',
    style_preset: 'dark',
    bg_color: '#161922',
    title_color: '#FFFFFF',
    descr_color: '#94A3B8',
    list: plans,
  });
  console.log('Update result:', res);

  // Fetch updated records
  const records = await client.getPageRecords(pageId);
  const r = records.find(x => x.id === rec1072 || (x.html && x.html.includes(rec1072)));
  console.log('Updated HTML snippet:');
  console.log(r?.html?.slice(0, 1500));
}

testPricingUpdate().catch(console.error);
