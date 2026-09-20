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
    bgPrimary: '#0F1117',
    bgSecondary: '#161922',
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
  /* Сброс дефолтных белых фонов для списков преимуществ тарифов */
  .t-pricing__features, .t-pricing__col, .t776__features, .t776__wrapper, .t142__features, .t142__wrapper {
    background: transparent !important;
    background-color: transparent !important;
  }

  /* Стилизация карточек тарифов в единый монолитный контейнер */
  .t776__col, .t776__wrapper, .t1072__content, .t142__wrapper, .t-pricing__col {
    background: rgba(15, 23, 42, 0.75) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 16px !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    overflow: hidden !important;
  }

  /* Читаемый светлый текст списка преимуществ тарифов */
  .t-pricing__features li, .t776__features li, .t142__features li {
    color: #e2e8f0 !important;
  }

  /* Верхний отступ и центрирование кнопок в карточках тарифов */
  .t776__btn-wrapper, .t-pricing__button, .t1072__footer {
    margin-top: 24px !important;
    background: transparent !important;
  }

  /* Glassmorphism для общих карточек и блоков */
  .t-card__col, .t-col, .t1072__content, .t533__col {
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
  }

  /* Шапка карточки 1072 */
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

export function getPresetCss(preset: StylePresetName): string {
  if (preset === 'dark') {
    return DARK_PRESET_CSS;
  }
  return '';
}
