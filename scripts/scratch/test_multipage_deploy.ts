import { MultipageOrchestrator } from '../../src/generators/multipage-orchestrator.js';
import { TildaHttpClient } from '../../src/client/tilda-http-client.js';
import { CONFIG } from '../../src/config.js';

async function runMultipageTest() {
  console.log('🚀 Запуск боевого теста многостраничной генерации на Tilda...');

  const client = new TildaHttpClient();
  await client.init();

  const projectId = CONFIG.TILDA_PROJECT_ID || '40607103';
  const orchestrator = new MultipageOrchestrator(client);

  const payload = {
    project_id: projectId,
    global_theme: 'linear' as const,
    navigation: [
      { label: 'Главная', target_slug: 'home' },
      { label: 'Тарифы и калькулятор', target_slug: 'pricing' },
      { label: 'Контакты', target_slug: 'contact' },
    ],
    pages: [
      {
        slug: 'home',
        title: 'DevTools Cloud — Инфраструктура нового поколения',
        descr: 'Автоматизированный облачный деплой и наблюдаемость в единой консоли.',
        sections: {
          hero: {
            title: 'Инфраструктура, которая масштабируется сама',
            descr: 'Деплойте K8s кластеры, настраивайте балансировщики и собирайте телеметрию за секунды.',
            badge: 'DEVTOOLS v2.4 CLOUD',
            btn1: { text: 'Попробовать бесплатно', href: '#contact' },
            btn2: { text: 'Тарифные планы', href: '#pricing' },
          },
          marquee: {
            items: [
              'Kubernetes',
              'Docker Engine',
              'PostgreSQL',
              'Redis Cache',
              'ClickHouse',
              'Prometheus',
              'Grafana',
            ],
          },
          features: {
            title: 'Возможности экосистемы',
            items: [
              {
                title: 'Автомасштабирование',
                descr: 'Выделение ресурсов от 1 до 500 нод за считанные секунды',
              },
              {
                title: 'L3/L4/L7 Защита',
                descr: 'Встроенная фильтрация паразитного трафика и DDoS-атак',
              },
              {
                title: 'Anycast DNS',
                descr: 'Маршрутизация с задержкой менее 15 мс по всему миру',
              },
            ],
          },
          timeline: {
            title: 'Как начать работу',
            descr: 'Четыре простых шага до первого рабочего продакшен-кластера',
            steps: [
              {
                num: '01',
                title: 'Создание проекта',
                descr: 'Подключите ваш Git-репозиторий в единой консоли',
              },
              {
                num: '02',
                title: 'Выбор топологии',
                descr: 'Сконфигурируйте ноды, сеть и политики безопасности',
              },
              {
                num: '03',
                title: 'Пайплайн CI/CD',
                descr: 'Настройте автоматические билды и canary-релизы',
              },
              {
                num: '04',
                title: 'Продакшен запуск',
                descr: 'Получите готовый домен с SSL-сертификатом и мониторингом',
              },
            ],
          },
        },
      },
      {
        slug: 'pricing',
        title: 'Тарифы и калькулятор — DevTools Cloud',
        descr: 'Гибкие тарифные планы и прозрачный расчет стоимости инфраструктуры.',
        sections: {
          calculator: {
            title: 'Интерактивный конфигуратор мощности',
            descr: 'Выберите необходимое количество нод для мгновенного расчета ежемесячного бюджета.',
            unit_label: 'узлов кластера',
            base_price: 6000,
            min: 1,
            max: 50,
            step: 1,
            default_value: 5,
            btn_text: 'Зафиксировать условия',
          },
          pricing: {
            title: 'Прозрачные тарифы без скрытых платежей',
            plans: [
              {
                name: 'Стартап',
                price: '4 900 ₽',
                period: 'в месяц',
                features: [
                  'До 3 рабочих узлов',
                  'Базовый мониторинг',
                  'Community-поддержка',
                  '99.9% SLA',
                ],
              },
              {
                name: 'Бизнес Pro',
                price: '18 900 ₽',
                period: 'в месяц',
                is_featured: true,
                features: [
                  'До 20 рабочих узлов',
                  'Выделенный Anycast IP',
                  'Круглосуточный SLA 99.99%',
                  'Приоритетная линия',
                ],
              },
              {
                name: 'Enterprise',
                price: 'Индивидуально',
                period: 'по запросу',
                features: [
                  'Безлимитные узлы',
                  'Персональный инженер',
                  'Кастомные контуры безопасности',
                  'On-premise опции',
                ],
              },
            ],
          },
          faq: {
            title: 'Часто задаваемые вопросы по оплате',
            items: [
              {
                question: 'Как работает скидка при оплате за год?',
                answer:
                  'При выборе годовой подписки автоматически применяется дисконт 20% на весь срок обслуживания.',
              },
              {
                question: 'Можно ли изменить конфигурацию в любой момент?',
                answer:
                  'Да, биллинг рассчитывается посекундно с пересчетом остатка на балансе.',
              },
              {
                question: 'Предоставляются ли закрывающие документы?',
                answer:
                  'Да, мы работаем с юридическими лицами по ЭДО и предоставляем полный пакет актов и счетов-фактур.',
              },
            ],
          },
        },
      },
      {
        slug: 'contact',
        title: 'Контакты и подключение — DevTools Cloud',
        descr: 'Свяжитесь с нашей инженерной командой для запуска пилотного проекта.',
        sections: {
          form: {
            title: 'Оставить заявку на подключение',
            descr:
              'Заполните форму, и наш архитектор свяжется с вами для обсуждения архитектуры и запуска 14-дневного триала.',
            btn_text: 'Отправить заявку архитектору',
            success_text:
              'Заявка успешно принята! Наш дежурный архитектор свяжется с вами в течение 15 минут.',
          },
        },
      },
    ],
  };

  const startTime = Date.now();
  const result = await orchestrator.generateMultipageSite(payload);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n🎉 Многостраничный сайт успешно развернут за ${elapsed}s!`);
  console.log('Результаты сборки:');
  console.table(result.pages);
}

runMultipageTest().catch((err) => {
  console.error('❌ Ошибка генерации:', err);
  process.exit(1);
});
