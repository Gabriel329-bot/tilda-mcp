export type StylePresetName = 'dark' | 'minimal' | 'warm';

export interface ColorTheme {
  bgPrimary: string;
  bgSecondary: string;
  textPrimary: string;
  textSecondary: string;
  accentBtnBg: string;
  accentBtnText: string;
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

export function getPresetCss(preset: StylePresetName): string {
  if (preset === 'dark') {
    return DARK_PRESET_CSS;
  }
  return '';
}
