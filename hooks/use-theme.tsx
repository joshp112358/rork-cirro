import { useEffect, useState, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { getTheme, ColorScheme } from '@/constants/theme';

const THEME_STORAGE_KEY = 'user_theme_preference';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [userPreference, setUserPreference] = useState<ColorScheme | 'system'>('system');
  const [isLoading, setIsLoading] = useState(true);

  const activeColorScheme: ColorScheme = 
    userPreference === 'system' 
      ? (systemColorScheme as ColorScheme) || 'light'
      : userPreference;

  const theme = useMemo(() => getTheme(activeColorScheme), [activeColorScheme]);

  const loadThemePreference = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        setUserPreference(stored as ColorScheme | 'system');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThemePreference();
  }, [loadThemePreference]);

  const setThemePreference = useCallback(async (preference: ColorScheme | 'system') => {
    try {
      setUserPreference(preference);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  }, []);

  return useMemo(() => ({
    theme,
    colorScheme: activeColorScheme,
    userPreference,
    setThemePreference,
    isLoading,
  }), [theme, activeColorScheme, userPreference, setThemePreference, isLoading]);
});