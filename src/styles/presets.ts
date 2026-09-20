export type StylePresetName = 'dark' | 'minimal' | 'warm' | 'dji' | 'linear' | 'apple';

export interface ColorTheme {
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  accentBtnBg: string;
  accentBtnText: string;
  accentBadge?: string;
  cardBg?: string;
}

export const STYLE_PRESETS: Record<StylePresetName, ColorTheme> = {
  dark: {
    bgPrimary: '#0A0B0E',
    bgSecondary: '#12141A',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    accentBtnBg: '#00F5FF',
    accentBtnText: '#000000',
  },
  minimal: {
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F8FAFC',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    accentBtnBg: '#0F172A',
    accentBtnText: '#FFFFFF',
  },
  warm: {
    bgPrimary: '#FAF7F2',
    bgSecondary: '#F3EFE6',
    textPrimary: '#292524',
    textSecondary: '#78716C',
    accentBtnBg: '#C25E38',
    accentBtnText: '#FFFFFF',
  },
  dji: {
    bgPrimary: '#000000',
    bgSecondary: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#6C7073',
    accentBtnBg: '#0070D5',
    accentBtnText: '#FFFFFF',
    accentBadge: '#3B63A9',
    cardBg: '#EDEDED',
  },
  linear: {
    bgPrimary: '#0F1117',
    bgSecondary: '#F8FAFC',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    accentBtnBg: '#5E6AD2',
    accentBtnText: '#FFFFFF',
    accentBadge: '#5E6AD2',
    cardBg: '#FFFFFF',
  },
  apple: {
    bgPrimary: '#000000',
    bgSecondary: '#F5F5F7',
    textPrimary: '#1D1D1F',
    textSecondary: '#86868B',
    accentBtnBg: '#0071E3',
    accentBtnText: '#FFFFFF',
    accentBadge: '#0071E3',
    cardBg: '#FFFFFF',
  },
};

export const DARK_PRESET_CSS = `<style>
  /* ========================================================= */
  /* 1. Глобальная премиальная типографика и фон (dark)       */
  /* ========================================================= */
  body, .t-body {
    background-color: #0A0B0E !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    color: #FFFFFF !important;
    -webkit-font-smoothing: antialiased;
  }

  /* Плотный межбуквенный интервал для заголовков */
  .t-title, .t-name, .t-heading, h1, h2, h3, .t-card__title, .t776__title {
    letter-spacing: -0.03em !important;
    font-weight: 700 !important;
    line-height: 1.15 !important;
  }

  /* Благородный серый цвет и читаемый интерлиньяж для подзаголовков */
  .t-descr, .t-text, .t-subtext, .t-card__descr, .t776__descr {
    color: #94A3B8 !important;
    line-height: 1.6 !important;
  }

  /* ========================================================= */
  /* 2. Стилизация тарифных карточек (PR04 / 776 / pricing)   */
  /* ========================================================= */
  /* Сброс дефолтных белых фонов для списков преимуществ */
  .t-pricing__features, .t-pricing__col, .t776__features, .t776__wrapper, .t142__features, .t142__wrapper {
    background: transparent !important;
    background-color: transparent !important;
  }

  /* Убрать стандартные маркеры списков */
  .t-pricing__features, .t776__features, .t142__features, .t776__descr ul, .t-card__descr ul {
    list-style: none !important;
    padding-left: 0 !important;
    margin-left: 0 !important;
  }

  /* Каждый пункт списка — современная строка с неоновым префиксом */
  .t-pricing__features li, .t776__features li, .t142__features li, .t776__descr ul li, .t-card__descr ul li {
    display: flex !important;
    align-items: center !important;
    padding: 10px 0 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
    color: #CBD5E1 !important;
    font-size: 15px !important;
    line-height: 1.4 !important;
  }
  .t-pricing__features li::before, .t776__features li::before, .t142__features li::before, .t776__descr ul li::before, .t-card__descr ul li::before {
    content: '\\2014\\00a0' !important;
    color: #00F5FF !important;
    margin-right: 10px !important;
    font-weight: 600 !important;
    flex-shrink: 0 !important;
  }

  /* Контейнеры карточек тарифов (единый полупрозрачный градиент) */
  .t776__col, .t776__wrapper, .t1072__content, .t142__wrapper, .t-pricing__col {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 20px !important;
    padding: 36px 28px !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    overflow: hidden !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  /* Скрытие отдельного дефолтного знака валюты ($) для предотвращения дублирования */
  .t776__price-currency, .t-pricing__currency, .t1072__price-currency {
    display: none !important;
  }

  /* Ховер-эффект с подъемом и подсветкой границы */
  .t776__col:hover, .t776__wrapper:hover, .t1072__content:hover, .t-pricing__col:hover {
    transform: translateY(-4px) !important;
    border-color: rgba(0, 245, 255, 0.3) !important;
    box-shadow: 0 12px 30px rgba(0, 245, 255, 0.1) !important;
  }

  /* Выделенная популярная карточка (is_featured) */
  .t776__featured, .t776__col_featured, .t1072__featured, .t-pricing__col_featured {
    border: 1px solid rgba(0, 245, 255, 0.35) !important;
    box-shadow: 0 0 35px rgba(0, 245, 255, 0.12) !important;
  }

  /* ========================================================= */
  /* 3. Крупная цена и кнопки (pill-button)                   */
  /* ========================================================= */
  /* Блок цены: крупный размер, жирный шрифт */
  .t776__price, .t-pricing__price, .t1072__price, .t-card__price {
    font-size: 38px !important;
    font-weight: 800 !important;
    color: #FFFFFF !important;
    letter-spacing: -0.02em !important;
    margin: 12px 0 20px 0 !important;
  }

  /* Кнопки: скругление pill-button (100px) и неоновое свечение */
  .t-btn, .t-submit, .t776__btn, .t-pricing__button {
    border-radius: 100px !important;
    font-weight: 700 !important;
    letter-spacing: 0.02em !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  /* Акцентные кнопки */
  .t-btn:not(.t-btnflex_type_button2), .t-submit {
    background: #00F5FF !important;
    color: #000000 !important;
    box-shadow: 0 0 25px rgba(0, 245, 255, 0.45) !important;
  }
  .t-btn:hover:not(.t-btnflex_type_button2), .t-submit:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 0 35px rgba(0, 245, 255, 0.7) !important;
  }

  /* Вторичные стеклянные кнопки */
  .t-btnflex_type_button2, .t-btn_transparent {
    background: transparent !important;
    color: #FFFFFF !important;
    border: 1px solid rgba(255, 255, 255, 0.25) !important;
  }
  .t-btnflex_type_button2:hover, .t-btn_transparent:hover {
    border-color: #00F5FF !important;
    color: #00F5FF !important;
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.3) !important;
  }

  /* Верхний отступ и центрирование кнопок в карточках тарифов */
  .t776__btn-wrapper, .t-pricing__button, .t1072__footer {
    margin-top: 24px !important;
    background: transparent !important;
  }

  /* ========================================================= */
  /* 4. Отзывы, карточки фичей (Bento) и поля формы            */
  /* ========================================================= */
  /* Bento-карточки для блока преимуществ / специальностей (FR205 / 491) */
  .t491__col, .t-card__col, .t513__col, .t-feed__col {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 16px !important;
    padding: 28px 24px !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    box-sizing: border-box !important;
    margin-bottom: 20px !important;
    transition: all 0.3s ease !important;
  }
  .t491__col:hover, .t-card__col:hover, .t513__col:hover {
    transform: translateY(-3px) !important;
    border-color: rgba(0, 245, 255, 0.3) !important;
    box-shadow: 0 10px 25px rgba(0, 245, 255, 0.08) !important;
  }

  /* Стилизация карточек отзывов (533) */
  .t533__wrapper {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 20px !important;
    padding: 30px !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
  }

  /* Стеклянные поля формы */
  .t-input {
    background: rgba(255, 255, 255, 0.04) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 12px !important;
    color: #FFFFFF !important;
  }
  .t-input:focus {
    border-color: #00F5FF !important;
    box-shadow: 0 0 15px rgba(0, 245, 255, 0.3) !important;
  }
</style>`;

export const DJI_PRESET_CSS = `<style>
  /* ========================================================= */
  /* 1. DJI Премиальный инженерный минимализм (dji)           */
  /* ========================================================= */
  body, .t-body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    background-color: #FFFFFF !important;
    color: #000000 !important;
  }

  /* Строгая типографика в стиле DJI: черный только для светлых секций */
  .t-section__title, .t-card__title, .t1050__col .t-heading, .t776__title {
    letter-spacing: -0.02em !important;
    font-weight: 600 !important;
    line-height: 1.25 !important;
    color: #000000 !important;
  }

  .t-descr, .t-text, .t-subtext, .t-card__descr, .t776__descr {
    color: #64748B !important;
    line-height: 1.6 !important;
  }

  /* Жесткая фиксация белого цвета текста для Hero-секции */
  .hero-premium h1, .t-cover h1, .t-cover .t-title, .custom-hero-section h1 {
    color: #FFFFFF !important;
  }
  .hero-premium p, .t-cover .t-descr, .custom-hero-section p {
    color: #E2E8F0 !important;
  }

  /* ========================================================= */
  /* 2. ПРАВИЛО ОДНОГО СИНЕГО: Кнопки (Pill #0070d5)          */
  /* ========================================================= */
  .t-btn, .t-submit, .t776__btn, .t-pricing__button, .t-btnflex {
    border-radius: 1408px !important;
    font-weight: 600 !important;
    letter-spacing: 0 !important;
    transition: all 0.2s ease-in-out !important;
  }

  /* Главная Sky CTA кнопка — единственное синее пятно */
  .t-btn:not(.t-btnflex_type_button2):not(.t-btn_transparent), .t-submit, .t776__btn, .t-pricing__button {
    background-color: #0070D5 !important;
    color: #FFFFFF !important;
    border: none !important;
    box-shadow: 0 4px 14px rgba(0, 112, 213, 0.25) !important;
    min-height: 40px !important;
    line-height: 40px !important;
    padding: 0 28px !important;
  }
  .t-btn:hover:not(.t-btnflex_type_button2):not(.t-btn_transparent), .t-submit:hover, .t776__btn:hover, .t-pricing__button:hover {
    background-color: #005bb5 !important;
    color: #FFFFFF !important;
    box-shadow: 0 6px 20px rgba(0, 112, 213, 0.4) !important;
    transform: translateY(-1px) !important;
  }

  /* Вторичные кнопки */
  .t-btnflex_type_button2, .t-btn_transparent {
    background-color: transparent !important;
    color: #000000 !important;
    border: 1px solid #CBD5E1 !important;
    box-shadow: none !important;
  }
  .t-cover .t-btnflex_type_button2, .t-cover .t-btn_transparent {
    color: #FFFFFF !important;
    border: 1px solid rgba(255, 255, 255, 0.7) !important;
  }
  .t-btnflex_type_button2:hover, .t-btn_transparent:hover {
    background-color: rgba(0, 0, 0, 0.04) !important;
    border-color: #94A3B8 !important;
  }
  .t-cover .t-btnflex_type_button2:hover, .t-cover .t-btn_transparent:hover {
    background-color: rgba(255, 255, 255, 0.15) !important;
    border-color: #FFFFFF !important;
  }

  /* ========================================================= */
  /* 3. Карточки лабораторий и фичей (FR104 / 491)             */
  /* ========================================================= */
  .t491__col, .t-card__col {
    background-color: #F4F5F7 !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 8px !important;
    padding: 36px 28px !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
    transition: all 0.2s ease-in-out !important;
    margin-bottom: 24px !important;
  }

  .t491__col:hover, .t-card__col:hover {
    border-color: #CBD5E1 !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04) !important;
    transform: translateY(-2px) !important;
  }

  .t491__col .t-card__title, .t-card__col .t-card__title {
    color: #000000 !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    margin-bottom: 12px !important;
    line-height: 1.35 !important;
    letter-spacing: -0.01em !important;
  }
  .t491__col .t-card__descr, .t-card__col .t-card__descr {
    color: #64748B !important;
    font-size: 14px !important;
    line-height: 1.6 !important;
  }

  /* ========================================================= */
  /* 4. Секция метрик (NM01 / 1050): строго черные цифры      */
  /* ========================================================= */
  .t1050__container {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 20px !important;
    justify-content: center !important;
  }
  .t1050__col {
    background-color: #F8FAFC !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 8px !important;
    padding: 32px 24px !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
    flex: 1 1 calc(25% - 20px) !important;
    min-width: 220px !important;
    transition: all 0.2s ease-in-out !important;
    text-align: center !important;
  }
  .t1050__col:hover {
    border-color: #CBD5E1 !important;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.03) !important;
    transform: translateY(-2px) !important;
  }
  .t1050__col .t-heading, .t1050__col .t-heading_lg {
    color: #000000 !important;
    font-size: 48px !important;
    font-weight: 700 !important;
    letter-spacing: -0.03em !important;
    margin-bottom: 12px !important;
    line-height: 1.1 !important;
  }
  .t1050__line {
    display: none !important;
  }
  .t1050__col .t-descr, .t1050__col .t-descr_sm {
    color: #64748B !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    line-height: 1.45 !important;
  }

  /* ========================================================= */
  /* 5. Карточки тарифов (PR04 / 776): нейтральный фон и Pill */
  /* ========================================================= */
  .t776__col {
    background-color: #F4F5F7 !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 8px !important;
    padding: 36px 30px !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
    transition: all 0.2s ease-in-out !important;
    margin-bottom: 24px !important;
  }
  .t776__col:hover {
    border-color: #CBD5E1 !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04) !important;
    transform: translateY(-2px) !important;
  }
  .t776__col[data-product-lid="1"], .t776__featured, .t776__col_featured {
    border: 1px solid #CBD5E1 !important;
  }
  .t776__title {
    font-size: 22px !important;
    font-weight: 600 !important;
    color: #000000 !important;
    margin-bottom: 6px !important;
  }
  .t776__price-currency, .t-pricing__currency, .t1072__price-currency {
    display: none !important;
  }
  .t776__price-value {
    font-size: 32px !important;
    font-weight: 700 !important;
    color: #000000 !important;
    margin: 12px 0 16px 0 !important;
  }
  .t776__descr ul {
    list-style: none !important;
    padding-left: 0 !important;
    margin: 20px 0 !important;
  }
  .t776__descr ul li {
    display: flex !important;
    align-items: center !important;
    padding: 10px 0 !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
    color: #334155 !important;
    font-size: 14px !important;
    line-height: 1.45 !important;
  }
  .t776__descr ul li::before {
    content: '\\2014\\00a0' !important;
    color: #64748B !important;
    margin-right: 8px !important;
    font-weight: 600 !important;
    flex-shrink: 0 !important;
  }

  /* Единственная синяя pill-кнопка в карточке тарифа */
  .t776__btn, .t-pricing__button {
    display: inline-block !important;
    width: 100% !important;
    margin-top: 24px !important;
    background-color: #0070D5 !important;
    color: #FFFFFF !important;
    border-radius: 1408px !important;
    font-weight: 600 !important;
    font-size: 15px !important;
    text-align: center !important;
    padding: 12px 24px !important;
    box-sizing: border-box !important;
    text-decoration: none !important;
    box-shadow: 0 4px 14px rgba(0, 112, 213, 0.25) !important;
    transition: all 0.2s ease-in-out !important;
  }
  .t776__btn:hover, .t-pricing__button:hover {
    background-color: #005bb5 !important;
    box-shadow: 0 6px 20px rgba(0, 112, 213, 0.4) !important;
    transform: translateY(-1px) !important;
  }

  /* Поля ввода формы в инженерном стиле */
  .t-input {
    background-color: #F8FAFC !important;
    border: 1px solid #E2E8F0 !important;
    border-radius: 6px !important;
    color: #000000 !important;
    box-shadow: none !important;
  }
  .t-input:focus {
    border-color: #94A3B8 !important;
    background-color: #FFFFFF !important;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05) !important;
  }
</style>`;

export function getPresetCss(preset: StylePresetName): string {
  if (preset === 'dark') {
    return DARK_PRESET_CSS;
  }
  if (preset === 'dji') {
    return DJI_PRESET_CSS;
  }
  return '';
}



