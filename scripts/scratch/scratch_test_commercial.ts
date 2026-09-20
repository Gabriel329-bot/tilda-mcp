import { TildaHttpClient } from '../../src/client/tilda-http-client.js';
import {
  packageHeroSection,
  packageMarqueeSection,
  packageFeaturesSection,
  packageTimelineSection,
  packageMetricsSection,
  packageCalculatorSection,
  packagePricingSection,
  packageFaqSection,
  packageContactSection,
  packageFooterSection,
} from '../../src/generators/block-packager.js';

async function buildCommercialLanding() {
  const projectId = '40607103';
  const presetKey = 'linear';
  const client = new TildaHttpClient({ humanLikePacing: false });

  console.log('[1/4] Проверка авторизации...');
  await client.checkAuth();

  console.log('[2/4] Создание новой коммерческой страницы...');
  const title = 'DevTools Platform // Enterprise Infra 2026';
  const pageId = await client.createPage(projectId, title);
  console.log(`      Страница создана: ID ${pageId}`);

  await client.initSession(pageId);

  console.log('[3/4] Сборка блоков Template Vault (Commercial Upgrade)...');

  // 1. Hero with Preload, Schema.org and CRO Overlays
  console.log('      - Добавление Hero (с предзагрузкой, JSON-LD и CRO оверлеями)...');
  const heroPkg = packageHeroSection(
    {
      title: 'Корпоративная облачная инфраструктура нового поколения',
      descr: 'Автоматизированное управление серверами, мониторинг сетевого трафика и масштабирование K8s за секунды.',
      badge: 'ENTERPRISE INFRA v3.0',
      btn1: { text: 'Начать бесплатно', href: '#form' },
      btn2: { text: 'Рассчитать смету', href: '#calculator' },
      backgroundUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80',
    },
    'tech',
    true,
    presetKey,
    {
      title,
      descr: 'Корпоративная облачная инфраструктура нового поколения',
      faq: {
        items: [
          { question: 'Как происходит миграция?', answer: 'Инженеры переносят базу данных и сервисы с нулевым простоем.' },
        ],
      },
      pricing: {
        plans: [{ name: 'Enterprise Pro', price: '49000 ₽' }],
      },
    },
    {
      stickyTitle: 'Инфраструктура Enterprise',
      stickySubtitle: '14 дней тест-драйва бесплатно',
      stickyBtn: 'Получить доступ',
      socialProofMsg: 'Дмитрий (Финтех) развернул кластер в Москве',
    }
  );
  const heroRec = await client.addBlock(pageId, heroPkg.tplId);
  await client.updateBlock(pageId, heroRec, heroPkg.fields);

  // 2. Marquee
  console.log('      - Добавление бегущей строки партнеров и стека (Marquee)...');
  const marqueePkg = packageMarqueeSection(
    ['Kubernetes', 'PostgreSQL 17', 'Docker', 'Redis Cluster', 'ClickHouse', 'Tailwind CSS', 'TypeScript', 'Prometheus'],
    presetKey
  );
  const marqueeRec = await client.addBlock(pageId, marqueePkg.tplId);
  await client.updateBlock(pageId, marqueeRec, marqueePkg.fields);

  // 3. Bento Features
  console.log('      - Добавление Bento Grid преимуществ...');
  const featPkg = packageFeaturesSection(
    {
      title: 'Возможности платформы',
      descr: 'Отказоустойчивость уровня 99.99% и прямое подключение к опорным сетям',
      items: [
        { title: 'Магистральные серверы', descr: 'Выделенные ноды NVMe Gen5 с гарантированной полосой пропускания' },
        { title: 'Защита трафика', descr: 'Автоматическая фильтрация DDoS-атак L3/L4/L7 на канальном уровне' },
        { title: 'Маршрутизация сетей', descr: 'Mesh-сети с минимальным пингом между ЦОД в Москве и СПб' },
        { title: 'Высокая скорость', descr: 'Запуск виртуальных машин и кластеров менее чем за 45 секунд' },
      ],
    },
    presetKey
  );
  const featRec = await client.addBlock(pageId, featPkg.tplId);
  await client.updateBlock(pageId, featRec, featPkg.fields);

  // 4. Timeline
  console.log('      - Добавление этапов («Как мы работаем» / Roadmap)...');
  const timePkg = packageTimelineSection(
    {
      title: 'Этапы подключения инфраструктуры',
      descr: 'Бесшовный переход без перерыва в предоставлении услуг',
      steps: [
        { step: '01', title: 'Аудит и бенчмарк', descr: 'Анализируем текущий профиль нагрузки и сетевые требования.' },
        { step: '02', title: 'Проектирование схемы', descr: 'Формируем архитектурный план кластера и репликации.' },
        { step: '03', title: 'Бесшовная миграция', descr: 'Переносим сервисы и данные без даунтайма для пользователей.' },
        { step: '04', title: 'Поддержка и SLA', descr: 'Круглосуточный мониторинг дежурными инженерами 24/7.' },
      ],
    },
    presetKey
  );
  const timeRec = await client.addBlock(pageId, timePkg.tplId);
  await client.updateBlock(pageId, timeRec, timePkg.fields);

  // 5. Metrics
  console.log('      - Добавление метрик и показателей...');
  const metrPkg = packageMetricsSection(
    {
      title: 'Платформа в цифрах',
      descr: 'Проверенная надежность в боевых условиях',
      items: [
        { title: '99.99%', descr: 'Доступность сервисов по SLA' },
        { title: '< 2.5 мс', descr: 'Задержка между дата-центрами' },
        { title: '100 Гбит/с', descr: 'Пропускная способность каналов' },
        { title: '24/7', descr: 'Дежурная смена сетевых инженеров' },
      ],
    },
    presetKey
  );
  const metrRec = await client.addBlock(pageId, metrPkg.tplId);
  await client.updateBlock(pageId, metrRec, metrPkg.fields);

  // 6. Interactive Calculator
  console.log('      - Добавление интерактивного калькулятора стоимости...');
  const calcPkg = packageCalculatorSection(
    {
      title: 'Калькулятор конфигурации узлов',
      descr: 'Выберите необходимое число серверов и моментально оцените бюджет',
    },
    presetKey
  );
  const calcRec = await client.addBlock(pageId, calcPkg.tplId);
  await client.updateBlock(pageId, calcRec, calcPkg.fields);

  // 7. Pricing with Switcher
  console.log('      - Добавление тарифов с переключателем периода (-20% в год)...');
  const pricePkg = packagePricingSection(
    {
      title: 'Тарифные планы',
      descr: 'Прозрачное ценообразование без скрытых переплат',
      plans: [
        {
          name: 'Базовый кластер',
          price: '15 000 ₽',
          period: 'месяц',
          features: ['3 выделенных узла', '1 ТБ NVMe хранилища', 'Канал 1 Гбит/с', 'Email-поддержка'],
        },
        {
          name: 'Enterprise Pro',
          price: '45 000 ₽',
          period: 'месяц',
          is_featured: true,
          features: ['10+ выделенных узлов', 'Резервирование каналов N+1', 'Канал 10 Гбит/с', 'Персональный архитектор 24/7'],
        },
      ],
    },
    presetKey
  );
  const priceRec = await client.addBlock(pageId, pricePkg.tplId);
  await client.updateBlock(pageId, priceRec, pricePkg.fields);

  // 8. FAQ
  console.log('      - Добавление интерактивного FAQ-аккордеона...');
  const faqPkg = packageFaqSection(
    {
      title: 'Часто задаваемые вопросы',
      descr: 'Все, что нужно знать о надежности и подключении',
      items: [
        { question: 'Предоставляется ли тестовый период?', answer: 'Да, мы предоставляем полный доступ к тестовому кластеру на 14 дней.' },
        { question: 'Каковы условия соглашения об уровне услуг (SLA)?', answer: 'Гарантируем 99.99% доступности с финансовой ответственностью.' },
        { question: 'Как оплачивать услуги?', answer: 'Поддерживаем оплату по безналичному расчету с НДС для юридических лиц и карты.' },
      ],
    },
    presetKey
  );
  const faqRec = await client.addBlock(pageId, faqPkg.tplId);
  await client.updateBlock(pageId, faqRec, faqPkg.fields);

  // 9. Contact Form
  console.log('      - Добавление формы захвата с маской телефона и валидацией...');
  const formPkg = packageContactSection(
    {
      title: 'Забронировать мощности',
      descr: 'Оставьте контакты технического руководителя. Мы подготовим расчет и откроем тестовый стенд сегодня.',
      btn_text: 'Отправить заявку',
    },
    undefined,
    presetKey
  );
  const formRec = await client.addBlock(pageId, formPkg.tplId);
  await client.updateBlock(pageId, formRec, formPkg.fields);

  // 10. Footer
  console.log('      - Добавление студийного подвала (Footer)...');
  const footPkg = packageFooterSection('DevTools Platform Inc.', presetKey);
  const footRec = await client.addBlock(pageId, footPkg.tplId);
  await client.updateBlock(pageId, footRec, footPkg.fields);

  console.log('\n[4/4] Публикация страницы...');
  const pubResult = await client.publishPage(pageId);
  console.log(`      ✓ Страница успешно опубликована: ${pubResult.publishedUrl}`);
  console.log(`      ✓ Edit URL: https://tilda.ru/page/?pageid=${pageId}`);
}

buildCommercialLanding().catch(console.error);
