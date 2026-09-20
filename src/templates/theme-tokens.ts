export interface ThemeTokens {
  id: string;
  accent: string;              // Основной акцент кнопок (напр. #0070D5)
  accentHover: string;         // Ховер кнопок (напр. #005bb5)
  accentGlow: string;          // Тень/свечение (напр. rgba(0, 112, 213, 0.25))
  radiusCard: string;          // Скругление карточек (напр. rounded-[4px], rounded-xl, rounded-2xl)
  radiusBtn: string;           // Скругление кнопок (напр. rounded-[1408px], rounded-lg)
  bgPageLight: string;         // Светлый фон страницы (напр. bg-white, bg-[#F5F5F7])
  bgCardLight: string;         // Светлая подложка карточек (напр. bg-[#F8FAFC], bg-white)
  borderLight: string;         // Граница на светлом фоне (напр. border-slate-200/80)
  fontFamily: string;          // Базовый шрифт (напр. font-['Open_Sans',sans-serif], font-sans)
}

export const THEMES: Record<string, ThemeTokens> = {
  // Промышленный минимализм DJI
  dji: {
    id: 'dji',
    accent: '#0070D5',
    accentHover: '#005BB5',
    accentGlow: 'rgba(0, 112, 213, 0.25)',
    radiusCard: 'rounded-[4px]',
    radiusBtn: 'rounded-[1408px]',
    bgPageLight: 'bg-white',
    bgCardLight: 'bg-[#F8FAFC]',
    borderLight: 'border-slate-200/80',
    fontFamily: "font-['Open_Sans',sans-serif]",
  },
  // Неоновое темное агентство / Киберпанк
  dark: {
    id: 'dark',
    accent: '#06B6D4', // Циан / Бирюза
    accentHover: '#0891B2',
    accentGlow: 'rgba(6, 182, 212, 0.3)',
    radiusCard: 'rounded-xl',
    radiusBtn: 'rounded-xl',
    bgPageLight: 'bg-[#0B0F17]',
    bgCardLight: 'bg-[#111827]',
    borderLight: 'border-cyan-500/20',
    fontFamily: "font-['Open_Sans',sans-serif]",
  },
  // Минималистичный SaaS / Linear
  linear: {
    id: 'linear',
    accent: '#5E6AD2', // Фирменный индиго Linear
    accentHover: '#4D58BF',
    accentGlow: 'rgba(94, 106, 210, 0.25)',
    radiusCard: 'rounded-lg',
    radiusBtn: 'rounded-lg',
    bgPageLight: 'bg-slate-50',
    bgCardLight: 'bg-white',
    borderLight: 'border-slate-200',
    fontFamily: "font-['Open_Sans',sans-serif]",
  },
  // Премиальный технологичный Apple
  apple: {
    id: 'apple',
    accent: '#0071E3',
    accentHover: '#0077ED',
    accentGlow: 'rgba(0, 113, 227, 0.25)',
    radiusCard: 'rounded-2xl',
    radiusBtn: 'rounded-full',
    bgPageLight: 'bg-[#F5F5F7]',
    bgCardLight: 'bg-white',
    borderLight: 'border-slate-200/60',
    fontFamily: "font-['Open_Sans',sans-serif]",
  },
};

export function getThemeTokens(presetName?: string): ThemeTokens {
  if (!presetName) return THEMES.dji;
  const key = presetName.toLowerCase();
  return THEMES[key] || THEMES.dji;
}
