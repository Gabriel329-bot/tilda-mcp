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
