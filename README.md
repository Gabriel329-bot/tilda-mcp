# ⚡ Tilda MCP Server

[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue.svg)](https://modelcontextprotocol.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-16%2F16%20Passed-brightgreen.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-BSL%201.1-amber.svg)](LICENSE)

**Tilda MCP Server** — промышленный сервер по протоколу **Model Context Protocol (MCP)** для автономной генерации, дизайн-оркестрации и точечного редактирования коммерческих лендингов на платформе **Tilda Publishing**.

Движок избавляет LLM от генерации разрозненного HTML «из головы» и опирается на архитектуру **Template Vault**: проверенные студийные шаблоны на базе Tailwind CSS, динамические дизайн-токены, векторные SVG-иконки, интерактивные микро-JS компоненты (калькулятор, переключатель периодов цен, аккордеон), CRO-оверлеи, сквозную аналитику (Яндекс.Метрика + GA4) и встроенную микроразметку Schema.org JSON-LD.

---

## 🚀 Архитектурные особенности

```
                ┌──────────────────────────────────────────────┐
                │          LLM / AI Agent (Claude, Cursor)     │
                └──────────────────────┬───────────────────────┘
                                       │ MCP Protocol
                                       ▼
                ┌──────────────────────────────────────────────┐
                │             Tilda MCP Server                 │
                │  - tilda_fast_generate_landing (One-Shot)    │
                │  - tilda_preview_landing (Local Dry Run)     │
                │  - tilda_update_page_section (Surgical <3s)  │
                └──────────────┬────────────────┬──────────────┘
                               │                │
            ┌──────────────────▼──┐          ┌──▼──────────────────┐
            │   Template Vault    │          │  Tilda HTTP Engine  │
            │  - Tailwind CSS     │          │  - Direct HTTP API  │
            │  - Theme Tokens     │          │  - CSRF Management  │
            │  - Lucide SVG Icons │          │  - Retry & Backoff  │
            │  - Interactive Calc │          │  - Rollback Shield  │
            │  - CRO & Sticky CTA │          │  - Fast Batching    │
            │  - Schema.org SEO   │          └──────────┬──────────┘
            │  - YM & GA4 Tracking│                     │
            └─────────────────────┘                     ▼
                                             ┌─────────────────────┐
                                             │  Tilda Publishing   │
                                             │  (Published Page)   │
                                             └─────────────────────┘
```

### 1. Архитектура Template Vault (T123 + Tailwind CSS)
Вместо ограниченных стандартных блоков Тильды секции генерируются через изолированные блоки кастомного кода **T123**:
* **Hero Section**: 
  * *Темный режим:* глубокий фактурный оверлей (75–80%), контрастный заголовок H1, пульсирующий статус-бейдж и двойной CTA.
  * *Светлый режим (Apple-style):* мягкий градиент (`from-white via-[#F5F5F7]`), глубокий угольный H1 (`#1D1D1F`), пилюльный бейдж с границей.
  * *Critical Preload:* мгновенный LCP за счет `<link rel="preload" as="image">`.
* **Marquee / Social Proof**: плавная бесконечная бегущая строка партнеров и стека технологий (`animate-[marquee_25s_linear_infinite]`) с градиентным размытием по краям.
* **Bento Grid Features**: адаптивная сетка карточек с чистыми Lucide SVG-иконками (24×24, stroke-width=2) и hover-эффектами.
* **Timeline / Roadmap**: наглядные 4 шага внедрения («Как мы работаем») с крупной нумерацией `01`–`04`.
* **Metrics & Numbers**: акцентные крупные цифры (`text-5xl`) с гарантированным контрастом и нейтральными описаниями.
* **Interactive Cost Calculator**: интерактивный конфигуратор/калькулятор со слайдером `<input type="range">` и живым пересчетом ориентировочной стоимости в рублях.
* **Pricing with Billing Switcher**: современная сетка тарифов с карточкой «Хит продаж» и интерактивным переключателем периода (Месяц / Год со скидкой `-20%`).
* **Interactive FAQ Accordion**: нативные элементы `<details>` с SVG-индикатором и плавной анимацией вращения шеврона без внешних библиотек.
* **Lead Capture Form**: форма захвата контактов с маской телефона РФ (`+7 (___) ___-__-__`), защитой от спама (Honeypot), встроенной валидацией и плавной прокруткой.
* **Custom Studio Footer**: адаптируемый темный/светлый подвал с бейджем версии, названием бренда и динамическим годом копирайта.

---

### 2. Глобальный CRO-слой (Конверсия и удержание)

Встроенный CRO-слой подключается поверх первого экрана и поднимает конверсию лендинга:
* **Mobile Sticky CTA Bar**: аккуратная фиксированная панель внизу мобильного экрана (`fixed bottom-0 sm:hidden`) с быстрой кнопкой заявки к `#form`.
* **Social Proof Toast**: ненавязчивое всплывающее уведомление в левом нижнем углу экрана (`fixed bottom-5 left-5 hidden sm:flex`) с таймером автозакрытия, подтверждающее активность реальных клиентов.
* **Cookie Consent Banner**: адаптивная плашка согласия на куки с сохранением выбора пользователя в `localStorage`.

---

### 3. Технический SEO & Schema.org JSON-LD

Модуль `SeoOrchestrator` автоматически встраивает валидную структурированную микроразметку:
* **Schema.org JSON-LD**:
  * `Organization`: название компании, логотип, описание.
  * `FAQPage`: все вопросы и ответы аккордеона для отображения в расширенных сниппетах Google/Яндекс.
  * `Product` & `Offer`: тарифные планы с валютой (RUB) и ценами.
* **OpenGraph & Twitter Card**: метатеги заголовка, превью-изображения и описания для соцсетей и мессенджеров.

---

### 3b. Сквозная аналитика & Автотрекинг целей (Яндекс.Метрика + GA4)

Модуль `AnalyticsOrchestrator` автоматически генерирует официальные счетчики и диспетчер `trackEvent(name, params)`:
* **Яндекс.Метрика (`ym_id`)**: официальный код счетчика с включенными `webvisor`, `clickmap`, `trackLinks`, `accurateTrackBounce`.
* **Google Analytics 4 (`ga_id`)**: официальная инициализация `gtag.js` и сборка событий.
* **Универсальный микро-диспетчер `trackEvent`**: единая точка входа для событий, отправляющая данные параллельно в `ym('reachGoal')`, `gtag('event')` и `dataLayer.push`.
* **Встроенные коммерческие цели**:
  * `lead_submit`: успешная отправка лид-формы (`{ form: 'main_contact' }`).
  * `calc_interact`: взаимодействие со слайдером калькулятора (`{ value: number }`) с 500ms debounce.
  * `billing_toggle`: переключение периода цен в тарифах (`{ period: 'annual' | 'monthly' }`).
  * `cta_click`: клики по конверсионным кнопкам (`hero_primary`, `pricing_plan`, `calc_primary`, `sticky_mobile_cta`).

---

### 3c. Надежная доставка лидов (Telegram + Webhook + Offline Buffer)

* **Telegram Bot Delivery**: мгновенная отправка заявок с формы прямо в рабочий Telegram-чат (`telegram_bot_token` + `telegram_chat_id`) с HTML-форматированием.
* **Webhook Endpoint**: интеграция с CRM (amoCRM, Bitrix24) через кастомный `webhook_url`.
* **LocalStorage Offline Buffer**: в случае недоступности сети или отсутствия API-ключей заявка надежно сохраняется в локальном буфере браузера (`tilda_offline_leads`).

---

### 4. Динамический Theme Switcher & Дизайн-токены

Любой лендинг на лету переключается между дизайн-системами с помощью интерфейса `ThemeTokens`:

| Пресет | Стиль и назначение | Акцент (`accent`) | Карточки (`radiusCard`) | Кнопки (`radiusBtn`) | Холст (`bgPage`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`dji`** | Промышленный минимализм | `#0070D5` | `rounded-[4px]` | `rounded-[1408px]` | Белый / `#F8FAFC` |
| **`dark`** | Неоновый киберпанк / High-Tech | `#06B6D4` | `rounded-xl` | `rounded-xl` | `#0B0F17` / `#111827` |
| **`linear`** | Минималистичный SaaS / DevTools | `#5E6AD2` | `rounded-lg` | `rounded-lg` | `bg-slate-50` / `#FFFFFF` |
| **`light`** / **`apple`** | Премиальный дизайн Apple-style | `#0071E3` | `rounded-2xl` | `rounded-full` | `#F5F5F7` / `#FFFFFF` |
| **`minimal`** | Чистый журнал / Корпоративный | `#0F172A` | `rounded-md` | `rounded-md` | `#FFFFFF` / `#F8FAFC` |
| **`warm`** | Теплый крафт / Рестораны | `#EA580C` | `rounded-xl` | `rounded-full` | `#FFFDF9` / `#FFF8F0` |

---

### 5. Отказоустойчивость уровня Enterprise

* **Сессионный Healthcheck (`checkAuth`)**: валидация куки до запуска генерации. Мгновенная ошибка `[AUTH_EXPIRED]`, если авторизация устарела.
* **Экспоненциальный Retry & Backoff**: автоматический повтор запросов (до 3 попыток с задержками 1000 мс и 2500 мс) при `429 Too Many Requests`, `502/503/504` и разрывах TCP.
* **Транзакционный откат (Auto-Rollback)**: в случае фатального сбоя на середине сборки созданный черновик страницы мгновенно перемещается в корзину (`movetobinpage`).
* **HTML/JSON Sanitizer**: экранирование кавычек, амперсандов, длинных тире и спецсимволов перед инъекцией в параметры Тильды.

---

## 🛠️ Структура репозитория

```
tilda-mcp/
├── scripts/                   # Сервисные утилиты, тесты сети, скрапперы
│   ├── scratch/               # Изолированные исследовательские скрипты
│   ├── fast-build.ts          # CLI-сборщик в ускоренном режиме
│   └── deploy-real.ts         # Скрипт деплоя на тестовую страницу
├── src/
│   ├── auth/                  # Авторизация Tilda и менеджер сессий Playwright
│   │   ├── login-helper.ts    # Интерактивный логин через браузер
│   │   ├── save-cookie.ts     # Сохранение куки в storageState
│   │   └── session-manager.ts # Управление состоянием сессий
│   ├── client/                # Сетевые клиенты Тильды
│   │   ├── tilda-http-client.ts # Высокоскоростной HTTP-клиент с CSRF и ретраями
│   │   ├── tilda-driver.ts    # Fallback-клиент на базе Playwright
│   │   └── tilda-client.ts    # Фасадный клиент
│   ├── generators/            # Движки сборки, валидации и SEO
│   │   ├── template-engine.ts # Рендерер шаблонов и резолвер дизайн-токенов
│   │   ├── block-packager.ts  # Упаковка секций в пакеты T123
│   │   ├── seo-orchestrator.ts# Schema.org JSON-LD и OpenGraph генератор
│   │   ├── guardrails.ts      # CSS-скоупинг и валидация безопасности
│   │   └── media-orchestrator.ts # Загрузка и привязка фоновых медиа
│   ├── styles/                # Пресеты оформления
│   │   └── presets.ts
│   ├── templates/             # Эталонная верстка Template Vault
│   │   ├── html-templates.ts  # Студийные HTML/Tailwind шаблоны
│   │   ├── icons.ts           # Векторный справочник Lucide SVG
│   │   └── theme-tokens.ts    # Спецификация и токен-сеты
│   ├── types/                 # Общие TypeScript интерфейсы
│   ├── config.ts              # Конфигурация окружения
│   └── index.ts               # Главная точка входа MCP-сервера
└── tests/                     # Интеграционные тесты (vitest)
    └── resilience.test.ts     # 13 комплексных сценариев проверки
```

---

## 📦 MCP Инструменты

### 1. `tilda_fast_generate_landing`
Сквозная генерация и публикация лендинга из 8–12 секций за **~8–11 секунд**:

```typescript
{
  title: "DevTools Platform // Enterprise Infra 2026",
  project_id: "40607103",
  style_preset: "linear", // 'linear' | 'dji' | 'dark' | 'light' | 'minimal' | 'warm'
  sections: {
    hero: {
      title: "Корпоративная облачная инфраструктура нового поколения",
      descr: "Автоматизированное управление серверами, мониторинг сетевого трафика и масштабирование K8s.",
      badge: "ENTERPRISE INFRA v3.0",
      btn1: { text: "Начать бесплатно", href: "#form" },
      btn2: { text: "Рассчитать смету", href: "#calculator" }
    },
    marquee: {
      items: ["Kubernetes", "PostgreSQL 17", "Docker", "Redis", "ClickHouse", "TypeScript"]
    },
    features: {
      title: "Возможности платформы",
      descr: "Отказоустойчивость уровня 99.99% и прямое подключение к опорным сетям",
      items: [
        { title: "Магистральные серверы", descr: "Выделенные ноды NVMe Gen5 с гарантированной полосой" },
        { title: "Защита трафика", descr: "Автоматическая фильтрация DDoS-атак L3/L4/L7" }
      ]
    },
    timeline: {
      title: "Этапы подключения инфраструктуры",
      descr: "Бесшовный переход без перерыва в предоставлении услуг",
      steps: [
        { step: "01", title: "Аудит и бенчмарк", descr: "Анализируем текущий профиль нагрузки" },
        { step: "02", title: "Проектирование схемы", descr: "Формируем архитектурный план кластера" },
        { step: "03", title: "Бесшовная миграция", descr: "Переносим сервисы и данные без даунтайма" },
        { step: "04", title: "Поддержка и SLA", descr: "Круглосуточный мониторинг дежурными инженерами" }
      ]
    },
    metrics: {
      title: "Платформа в цифрах",
      items: [
        { title: "99.99%", descr: "SLA доступности сервисов" },
        { title: "< 2.5 мс", descr: "Задержка между дата-центрами" }
      ]
    },
    calculator: {
      title: "Калькулятор конфигурации узлов",
      descr: "Выберите необходимое число серверов и моментально оцените бюджет"
    },
    pricing: {
      title: "Тарифные планы",
      descr: "Прозрачное ценообразование без скрытых переплат",
      plans: [
        { name: "Базовый кластер", price: "15 000 ₽", period: "месяц", features: ["3 выделенных узла", "1 ТБ NVMe"] },
        { name: "Enterprise Pro", price: "45 000 ₽", period: "месяц", features: ["10+ узлов", "SLA 24/7"], is_featured: true }
      ]
    },
    faq: {
      title: "Частые вопросы",
      items: [
        { question: "Предоставляется ли тестовый период?", answer: "Да, доступ к тестовому кластеру на 14 дней бесплатно." }
      ]
    },
    form: {
      title: "Забронировать мощности",
      descr: "Оставьте заявку на бесплатный тестовый стенд.",
      btn_text: "Отправить заявку"
    }
  }
}
```

### 2. `tilda_preview_landing`
Мгновенная локальная компиляция лендинга в монолитный HTML-файл для браузерного предпросмотра (**Dry Run**, 0 обращений к Tilda API, экономия квот):
* Собирает все секции, Tailwind CDN, шрифт Google Fonts, микро-JS, Schema.org и счетчики аналитики.
* Сохраняет файл в `preview/landing-preview.html` и возвращает готовую кликабельную ссылку `file:///...`.
* Принимает ту же конфигурацию, что и `tilda_fast_generate_landing`.

### 3. `tilda_update_page_section`
Хирургическое обновление конкретной секции без пересборки всей страницы (**~2.5–3 сек**):
* Обновление цен в тарифах (`pricing`).
* Изменение вопросов в `faq`.
* Корректировка заголовков и CTA в `hero`.

---

## 🚀 Установка и быстрый старт

### 1. Клонирование и сборка

```bash
git clone https://github.com/Gabriel329-bot/tilda-mcp.git
cd tilda-mcp
npm install
npm run build
```

### 2. Настройка авторизации

Сервер поддерживает два способа авторизации в Tilda:

#### Способ А: Интерактивный вход (Рекомендуется)
Запустите интерактивный вход через Playwright:
```bash
npm run login
```
Откроется окно браузера. Авторизуйтесь в личном кабинете Tilda. Сессия и куки автоматически сохранятся в `storage/storage_state.json`.

#### Способ Б: Через файл `.env`
Создайте `.env` в корне проекта:
```env
TILDA_COOKIES="ssaid=ВАШ_SSAID; tildauid=ВАШ_TILDAUID"
TILDA_PROJECT_ID="40607103"
```

---

## ⚙️ Подключение к Claude Desktop / Cursor

Добавьте сервер в ваш конфигурационный файл MCP (например, `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "tilda": {
      "command": "node",
      "args": ["d:/TildaMCP/dist/index.js"],
      "env": {
        "TILDA_COOKIES": "ssaid=...; tildauid=...",
        "TILDA_PROJECT_ID": "40607103"
      }
    }
  }
}
```

Для запуска в режиме разработки с автоперезагрузкой:
```json
{
  "mcpServers": {
    "tilda-dev": {
      "command": "npx",
      "args": ["tsx", "d:/TildaMCP/src/index.ts"]
    }
  }
}
```

---

## 🧪 Тестирование

Набор тестов проверяет надежность HTTP-движка, механизмы ретраев, отката, генерацию компонентов Template Vault, переключатели тарифов, Schema.org и сквозную аналитику:

```bash
npm test
```

Результат:
```
 ✓ tests/resilience.test.ts (16 tests)
   - Scenario 1: Retry Success (429 Too Many Requests -> 200 OK)
   - Scenario 2: Retry Exhaustion (3x 502 -> Throws Error)
   - Scenario 2b: Retry Exhaustion on Network Error (ECONNRESET)
   - Scenario 3: Rollback on Failure (deletePage calls movetobinpage)
   - Scenario 4: Rollback Error Shielding
   - Scenario 5: JSON & Text Field Sanitization
   - Scenario 6: Dark Preset Pricing CSS & Monolithic Template Mapping
   - Scenario 7: DJI Preset Tokens, Component Rules & CSS
   - Scenario 8: Template Vault (Hero, Bento, Metrics, Pricing) & SVG Icons
   - Scenario 9: Dynamic Theme Switcher & Design Tokens (dji, dark, linear)
   - Scenario 10: Custom Studio Footer Section (T123)
   - Scenario 11: Light Preset & Studio Components (Apple Style)
   - Scenario 12: Commercial Upgrade (Marquee, Timeline, Calculator, Billing Toggle, Schema.org, CRO)
   - Scenario 13: Phase 1 Stabilization (Dehardcoded Success Text, Phone Validation, Honeypot, CRO flags)
   - Scenario 14: Phase 2 Core Advanced & DX (Local Preview, Calculator Customization, Telegram Backup)
   - Scenario 15: Phase 3 End-to-End Analytics & Goal Tracking (Yandex.Metrika + GA4 + Universal Dispatcher)

 Test Files  1 passed (1)
      Tests  16 passed (16)
```

---

## 📄 Лицензия

Проект распространяется под лицензией **BSL 1.1 (Business Source License)**:
* ✅ **Разрешено:** изучение исходного кода, форки для личных некоммерческих тестов, локальная разработка и аудит.
* ❌ **Запрещено:** коммерческое использование в продакшене, применение агентствами для сдачи клиентских сайтов, развёртывание платных сервисов или API на базе данного кода без письменного согласия правообладателя.
* По вопросам коммерческого лицензирования свяжитесь через профиль автора.
