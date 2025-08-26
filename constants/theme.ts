export type ColorScheme = 'light' | 'dark';

const lightColors = {
  // Notion-inspired colors
  primary: '#000000',        // Pure black
  secondary: '#6B7280',      // Medium gray
  accent: '#3B82F6',         // Subtle blue accent
  background: '#FFFFFF',     // Pure white
  backgroundSecondary: '#FAFAFA',
  card: '#FFFFFF',
  cardSecondary: '#FAFAFA',
  text: '#000000',           // Pure black
  textSecondary: '#6B7280',  // Medium gray
  textTertiary: '#9CA3AF',   // Light gray
  border: '#E5E7EB',         // Very light gray
  borderSecondary: '#F3F4F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Cannabis-specific colors
  thc: '#10B981',
  cbd: '#3B82F6',
  strain: '#F59E0B',
};

const darkColors = {
  // Notion dark theme colors
  primary: '#FFFFFF',        // Pure white
  secondary: '#9CA3AF',      // Light gray
  accent: '#60A5FA',         // Subtle blue accent
  background: '#000000',     // Pure black
  backgroundSecondary: '#0A0A0A',
  card: '#111111',
  cardSecondary: '#1A1A1A',
  text: '#FFFFFF',           // Pure white
  textSecondary: '#9CA3AF',  // Light gray
  textTertiary: '#6B7280',   // Medium gray
  border: '#1F2937',         // Dark gray
  borderSecondary: '#374151',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  
  // Cannabis-specific colors
  thc: '#34D399',
  cbd: '#60A5FA',
  strain: '#FBBF24',
};

export const getTheme = (colorScheme: ColorScheme) => ({
  colors: colorScheme === 'light' ? lightColors : darkColors,
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  
  borderRadius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
  
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  
  fontWeight: {
    thin: '100' as const,
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '900' as const,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  
  shadow: {
    small: {
      shadowColor: colorScheme === 'light' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: colorScheme === 'light' ? 0.05 : 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: colorScheme === 'light' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: colorScheme === 'light' ? 0.08 : 0.4,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowColor: colorScheme === 'light' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colorScheme === 'light' ? 0.12 : 0.5,
      shadowRadius: 8,
      elevation: 4,
    },
  }
});

// Default theme for backward compatibility
export const theme = getTheme('light');