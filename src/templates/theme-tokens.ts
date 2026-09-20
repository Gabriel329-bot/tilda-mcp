export interface ThemeTokens {
  id: string;
  isDark: boolean;             // Флаг темной или светлой базы
  accent: string;              // Акцент кнопок (#0071E3 для Apple)
  accentHover: string;         // Ховер (#0077ED)
  accentGlow: string;          // Свечение (rgba(0, 113, 227, 0.2))
  radiusCard: string;          // Скругление карточек (rounded-2xl)
  radiusBtn: string;           // Скругление кнопок (rounded-full)
  bgPage: string;              // Фон страницы (bg-[#F5F5F7])
  bgCard: string;              // Фон карточек (bg-white)
  border: string;              // Бордеры (border-black/[0.06] или border-slate-200)
  textPrimary: string;         // Основной заголовок (text-[#1D1D1F])
  textSecondary: string;       // Описание (text-[#86868B] или text-slate-500)
  fontFamily: string;
  fontImportUrl: string;       // URL Google Fonts
  // Опциональные алиасы для обратной совместимости
  bgPageLight?: string;
  bgCardLight?: string;
  borderLight?: string;
}

export const THEMES: Record<string, ThemeTokens> = {
  // Промышленный минимализм DJI
  dji: {
    id: 'dji',
    isDark: true,
    accent: '#0070D5',
    accentHover: '#005BB5',
    accentGlow: 'rgba(0, 112, 213, 0.25)',
    radiusCard: 'rounded-[4px]',
    radiusBtn: 'rounded-[1408px]',
    bgPage: 'bg-white',
    bgCard: 'bg-[#F8FAFC]',
    border: 'border-slate-200/80',
    bgPageLight: 'bg-white',
    bgCardLight: 'bg-[#F8FAFC]',
    borderLight: 'border-slate-200/80',
    textPrimary: 'text-slate-950',
    textSecondary: 'text-slate-600',
    fontFamily: "font-['Open_Sans',sans-serif]",
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap',
  },
  // Неоновое темное агентство / Киберпанк
  dark: {
    id: 'dark',
    isDark: true,
    accent: '#06B6D4', // Циан / Бирюза
    accentHover: '#0891B2',
    accentGlow: 'rgba(6, 182, 212, 0.3)',
    radiusCard: 'rounded-xl',
    radiusBtn: 'rounded-xl',
    bgPage: 'bg-[#0B0F17]',
    bgCard: 'bg-[#111827]',
    border: 'border-cyan-500/20',
    bgPageLight: 'bg-[#0B0F17]',
    bgCardLight: 'bg-[#111827]',
    borderLight: 'border-cyan-500/20',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    fontFamily: "font-['Open_Sans',sans-serif]",
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap',
  },
  // Минималистичный SaaS / Linear
  linear: {
    id: 'linear',
    isDark: true,
    accent: '#5E6AD2', // Фирменный индиго Linear
    accentHover: '#4D58BF',
    accentGlow: 'rgba(94, 106, 210, 0.25)',
    radiusCard: 'rounded-lg',
    radiusBtn: 'rounded-lg',
    bgPage: 'bg-[#090D16]',
    bgCard: 'bg-[#111624]',
    border: 'border-white/10',
    bgPageLight: 'bg-[#090D16]',
    bgCardLight: 'bg-[#111624]',
    borderLight: 'border-white/10',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    fontFamily: "font-['Inter',sans-serif]",
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap',
  },
  // Премиальный технологичный Apple / Light
  apple: {
    id: 'apple',
    isDark: false,
    accent: '#0071E3',
    accentHover: '#0077ED',
    accentGlow: 'rgba(0, 113, 227, 0.15)',
    radiusCard: 'rounded-2xl',
    radiusBtn: 'rounded-full',
    bgPage: 'bg-[#F5F5F7]',
    bgCard: 'bg-white',
    border: 'border-black/[0.08]',
    bgPageLight: 'bg-[#F5F5F7]',
    bgCardLight: 'bg-white',
    borderLight: 'border-black/[0.08]',
    textPrimary: 'text-[#1D1D1F]',
    textSecondary: 'text-slate-500',
    fontFamily: "font-['Plus_Jakarta_Sans',sans-serif]",
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  },
  // Светлый премиум-пресет Light
  light: {
    id: 'light',
    isDark: false,
    accent: '#0071E3',
    accentHover: '#0077ED',
    accentGlow: 'rgba(0, 113, 227, 0.15)',
    radiusCard: 'rounded-2xl',
    radiusBtn: 'rounded-full',
    bgPage: 'bg-[#F5F5F7]',
    bgCard: 'bg-white',
    border: 'border-black/[0.08]',
    bgPageLight: 'bg-[#F5F5F7]',
    bgCardLight: 'bg-white',
    borderLight: 'border-black/[0.08]',
    textPrimary: 'text-[#1D1D1F]',
    textSecondary: 'text-slate-500',
    fontFamily: "font-['Plus_Jakarta_Sans',sans-serif]",
    fontImportUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  },
};

export function getThemeTokens(presetName?: string): ThemeTokens {
  if (!presetName) return THEMES.dji;
  const key = presetName.toLowerCase();
  return THEMES[key] || THEMES.dji;
}
