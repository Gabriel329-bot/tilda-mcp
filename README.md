# ⚡ Tilda MCP Server

[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue.svg)](https://modelcontextprotocol.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-12%2F12%20Passed-brightgreen.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-BSL%201.1-amber.svg)](LICENSE)

**Tilda MCP Server** — промышленный сервер по протоколу **Model Context Protocol (MCP)** для автономной генерации, дизайн-оркестрации и точечного редактирования коммерческих лендингов на платформе **Tilda Publishing**.

Движок избавляет LLM от генерации разрозненного HTML «из головы» и опирается на архитектуру **Template Vault**: проверенные студийные шаблоны на базе Tailwind CSS, динамические дизайн-токены, векторные SVG-иконки и микро-JS компоненты с гарантированным контрастом, адаптивностью и высокой конверсией.

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
                │  - tilda_update_page_section (Surgical <3s)  │
                └──────────────┬────────────────┬──────────────┘
                               │                │
            ┌──────────────────▼──┐          ┌──▼──────────────────┐
            │   Template Vault    │          │  Tilda HTTP Engine  │
            │  - Tailwind CSS     │          │  - Direct HTTP API  │
            │  - Theme Tokens     │          │  - CSRF Management  │
            │  - Lucide SVG Icons │          │  - Retry & Backoff  │
            │  - Micro-JS & IMask │          │  - Rollback Shield  │
            └─────────────────────┘          └──────────┬──────────┘
                                                        │
                                                        ▼
                                             ┌─────────────────────┐
                                             │  Tilda Publishing   │
                                             │  (Published Page)   │
                                             └─────────────────────┘
```

### 1. Архитектура Template Vault (T123 + Tailwind CSS)
Вместо ограниченных стандартных блоков Тильды критические секции генерируются через изолированные блоки кастомного кода **T123**:
* **Hero Section**: 
  * *Темный режим:* глубокий фактурный оверлей (75–80%), контрастный заголовок H1, пульсирующий статус-бейдж и двойной CTA.
  * *Светлый режим (Apple-style):* мягкий градиент (`from-white via-[#F5F5F7]`), глубокий угольный H1 (`#1D1D1F`), пилюльный бейдж с границей.
* **Bento Grid Features**: адаптивная сетка карточек с чистыми Lucide SVG-иконками (24×24, stroke-width=2) и hover-эффектами.
* **Metrics & Numbers**: акцентные крупные цифры (`text-5xl`) с гарантированным контрастом и нейтральными описаниями.
* **Pricing Tables**: современная сетка тарифов с выделением популярного плана («Хит продаж»), списком фичей с SVG-чекмарками и акцентными кнопками.
* **Interactive FAQ Accordion**: нативные элементы `<details>` с SVG-индикатором и плавной анимацией вращения шеврона без внешних библиотек.
* **Lead Capture Form**: форма захвата контактов с маской телефона РФ (`+7 (___) ___-__-__`), защитой от спама (Honeypot), встроенной валидацией и плавной прокруткой.
* **Custom Studio Footer**: адаптируемый темный/светлый подвал с бейджем версии, названием бренда и динамическим годом копирайта.

---

### 2. Динамический Theme Switcher & Дизайн-токены

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

### 3. Отказоустойчивость уровня Enterprise

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
│   ├── generators/            # Движки сборки и валидации
│   │   ├── template-engine.ts # Рендерер шаблонов и резолвер дизайн-токенов
│   │   ├── block-packager.ts  # Упаковка секций в пакеты T123
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
    └── resilience.test.ts     # 12 комплексных сценариев проверки
```

---

## 📦 MCP Инструменты

### 1. `tilda_fast_generate_landing`
Сквозная генерация и публикация лендинга из 8–10 секций за **~7–10 секунд**:

```typescript
{
  title: "DevTools Cloud — Инфраструктура нового поколения",
  project_id: "40607103",
  style_preset: "linear", // 'linear' | 'dji' | 'dark' | 'light' | 'minimal' | 'warm'
  sections: {
    hero: {
      title: "Автоматизированная облачная платформа",
      descr: "Деплой за секунды, телеметрия и мониторинг в единой консоли.",
      badge: "DEVTOOLS v2.4",
      btn1: { text: "Начать бесплатно", href: "#form" },
      btn2: { text: "Документация", href: "#features" }
    },
    features: {
      title: "Возможности платформы",
      items: [
        { title: "Кластеры K8s", descr: "Автомасштабирование под любые нагрузки" },
        { title: "Защита от DDoS", descr: "Фильтрация трафика на уровне L3/L4/L7" }
      ]
    },
    metrics: {
      title: "Платформа в цифрах",
      items: [
        { title: "99.99%", descr: "SLA доступности" },
        { title: "<15ms", descr: "Средняя задержка сети" }
      ]
    },
    pricing: {
      title: "Тарифные планы",
      plans: [
        { name: "Старт", price: "0 ₽", period: "в месяц", features: ["1 кластер", "Community поддержка"] },
        { name: "Pro", price: "4 900 ₽", period: "в месяц", features: ["Безлимитные узлы", "24/7 SLA"], is_featured: true }
      ]
    },
    faq: {
      title: "Частые вопросы",
      items: [
        { question: "Как перенести существующие сервисы?", answer: "Предоставляем CLI-утилиту для бесшовной миграции." }
      ]
    },
    form: {
      title: "Подключить инфраструктуру",
      descr: "Оставьте заявку на бесплатный тестовый период 14 дней.",
      btn_text: "Отправить заявку"
    }
  }
}
```

### 2. `tilda_update_page_section`
Хирургическое обновление конкретной секции без пересборки всей страницы (**~2.5–3 сек**):
* Обновление цен в тарифах (`pricing`).
* Добавление/изменение вопросов в `faq`.
* Изменение заголовков и CTA в `hero`.

---

## 🚀 Установка и быстрый старт

### 1. Клонирование и установка зависимостей

```bash
git clone https://github.com/Gabriel329-bot/tilda-mcp.git
cd tilda-mcp
npm install
npm run build
```

### 2. Настройка авторизации

Сервер поддерживает два способа авторизации в Tilda:

#### Способ А: Интерактивный вход (Рекомендуется)
Запустите интерактивный скрипт входа через Playwright:
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

Для запуска в режиме отладки с автоперезагрузкой:
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

Набор тестов проверяет надежность HTTP-движка, механизмы ретраев, отката и корректность генерации шаблонов Template Vault:

```bash
npm test
```

Результат:
```
 ✓ tests/resilience.test.ts (12 tests)
   - Scenario 1: Retry Success (429 Too Many Requests -> 200 OK)
   - Scenario 2: Retry Exhaustion (3x 502 -> Throws Error)
   - Scenario 2b: Retry Exhaustion on Network Error (ECONNRESET)
   - Scenario 3: Rollback on Failure (deletePage calls movetobinpage)
   - Scenario 4: Rollback Error Shielding
   - Scenario 5: JSON & Text Field Sanitization
   - Scenario 6: Dark Preset Pricing CSS & Monolithic Template Mapping
   - Scenario 7: Full Landing Generation Payload Structure
   - Scenario 8: Template Vault (Hero, Bento, Metrics, Pricing) & SVG Icons
   - Scenario 9: Dynamic Theme Switcher & Design Tokens (dji, dark, linear)
   - Scenario 10: Custom Studio Footer Section (T123)
   - Scenario 11: Light Preset & Studio Components (Apple Style)

 Test Files  1 passed (1)
      Tests  12 passed (12)
```

---

## 📄 Лицензия

Проект распространяется под лицензией **BSL 1.1 (Business Source License)**:
* ✅ **Разрешено:** изучение исходного кода, форки для личных некоммерческих тестов, локальная разработка и аудит.
* ❌ **Запрещено:** коммерческое использование в продакшене, применение агентствами для сдачи клиентских сайтов, развёртывание платных сервисов или API на базе данного кода без письменного согласия правообладателя.
* По вопросам коммерческого лицензирования свяжитесь через профиль автора.
