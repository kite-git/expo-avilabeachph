/**
 * Avila Beach resort palette: yellow, white and brown. The app is light mode only.
 */

import '@/global.css';

import { Platform } from 'react-native';

const Brand = {
  yellow: '#F5C33B',
  yellowSoft: '#FDF0C4',
  brown: '#4A3222',
  brownDeep: '#2E2118',
  brownSoft: '#EFE3D3',
  white: '#FFFFFF',
} as const;

export const Colors = {
  text: Brand.brownDeep,
  textSecondary: '#8C7A69',
  /** Placeholders, disabled days. */
  textMuted: '#C2B5A6',
  /** Screen background. */
  background: '#F6F2EC',
  /** Cards, sheets, bars. */
  backgroundElement: Brand.white,
  /** Icon tiles and quiet fills inside cards. */
  backgroundSelected: '#F4EDE2',
  border: '#EAE1D4',
  primary: Brand.brown,
  onPrimary: Brand.white,
  accent: Brand.yellow,
  onAccent: Brand.brownDeep,
  accentSoft: Brand.yellowSoft,
  brownSoft: Brand.brownSoft,
} as const;

export type ThemeColor = keyof typeof Colors;

/** DM Sans faces, loaded in `app/_layout.tsx`. Use these instead of `fontWeight`. */
export const FontFamily = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semibold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
} as const;

export const Radius = {
  sheet: 32,
  card: 24,
  tile: 16,
  field: 14,
  pill: 999,
} as const;

export const Shadow = {
  /** Soft lift for cards and tiles. */
  card: '0px 6px 20px rgba(74, 50, 34, 0.08)',
  /** Stronger lift for primary buttons and the add button. */
  raised: '0px 10px 24px rgba(74, 50, 34, 0.28)',
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 1100;
/** Narrow column for single forms on large screens. */
export const MaxFormWidth = 640;
/** Shortest screen side at which the tablet layout (side rail, two columns) kicks in. */
export const TabletMinShortSide = 600;

/**
 * Chart series colors: deeper steps of the brand gold and brown, validated for
 * lightness, chroma and colorblind separation on white. Gold is under 3:1 contrast,
 * so charts must keep their legend and tap-to-read values.
 */
export const ChartColors = {
  income: '#C99212',
  expenses: '#9A5524',
} as const;
