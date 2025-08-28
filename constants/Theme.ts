import { Colors, Spacings, Typography, ThemeManager } from 'react-native-ui-lib';

// Define professional, muted colors for the fasting app
export const FastingColors = {
  // Primary brand colors - muted greens
  primary: '#6B7280',
  primaryLight: '#9CA3AF',
  primaryDark: '#4B5563',
  
  // Secondary colors - subtle blues
  secondary: '#64748B',
  secondaryLight: '#94A3B8',
  secondaryDark: '#475569',
  
  // Accent colors - warm neutrals
  accent: '#78716C',
  accentLight: '#A8A29E',
  accentDark: '#57534E',
  
  // Status colors - professional tones
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  
  // Neutral colors - professional greys
  white: '#FFFFFF',
  black: '#111827',
  grey10: '#F9FAFB',
  grey20: '#F3F4F6',
  grey30: '#E5E7EB',
  grey40: '#D1D5DB',
  grey50: '#9CA3AF',
  grey60: '#6B7280',
  grey70: '#4B5563',
  grey80: '#374151',
  grey90: '#1F2937',
  
  // App specific colors - muted professional tones
  fastingActive: '#059669',
  fastingInactive: '#E5E7EB',
  streakAccent: '#D97706',
  cardBackground: '#FFFFFF',
  cardShadow: 'rgba(0,0,0,0.05)',
  surfaceElevated: '#FAFAFA',
  
  // Subtle gradients
  primaryGradient: ['#6B7280', '#9CA3AF'],
  secondaryGradient: ['#64748B', '#94A3B8'],
  accentGradient: ['#78716C', '#A8A29E'],
  successGradient: ['#059669', '#10B981'],
};

// Beautiful typography scale
export const FastingTypography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h5: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  h6: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  
  body1: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  overline: { fontSize: 10, fontWeight: '500', lineHeight: 16, textTransform: 'uppercase' as const },
  
  button: { fontSize: 16, fontWeight: '600', lineHeight: 20 },
  buttonSmall: { fontSize: 14, fontWeight: '600', lineHeight: 18 },
};

// Consistent spacing
export const FastingSpacings = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

// Apply theme
export const setupTheme = () => {
  // Load UI Lib colors (excluding gradient arrays)
  const { primaryGradient, secondaryGradient, accentGradient, successGradient, ...colors } = FastingColors;
  Colors.loadColors(colors);
  
  // Load UI Lib typography
  Typography.loadTypographies(FastingTypography);
  
  // Load UI Lib spacings
  Spacings.loadSpacings(FastingSpacings);
  
  // Set theme
  ThemeManager.setComponentTheme('Card', {
    borderRadius: 16,
    backgroundColor: FastingColors.cardBackground,
    shadowColor: FastingColors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: FastingSpacings.m,
  });
  
  ThemeManager.setComponentTheme('Button', {
    borderRadius: 25,
    paddingH: FastingSpacings.l,
    paddingV: FastingSpacings.m,
  });
  
  ThemeManager.setComponentTheme('Text', {
    color: FastingColors.grey80,
  });
};