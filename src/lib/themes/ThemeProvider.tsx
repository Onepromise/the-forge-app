import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_THEME_ID,
  THEMES,
  THEME_STORAGE_KEY,
  getTheme,
  isThemeAvailable,
} from './registry';
import type { ThemeDefinition } from './theme';

interface ThemeContextValue {
  /** The active theme pack. */
  theme: ThemeDefinition;
  themeId: string;
  /** Switch packs. Silently ignores unknown or locked (unpaid) packs. */
  setThemeId: (id: string) => void;
  /** Packs the user currently has access to (feeds the future store UI). */
  availableThemes: ThemeDefinition[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>(DEFAULT_THEME_ID);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved && THEMES[saved] && isThemeAvailable(saved)) {
          setThemeIdState(saved);
        }
      } catch {
        // keep the default theme
      }
    })();
  }, []);

  const setThemeId = useCallback((id: string) => {
    if (!THEMES[id] || !isThemeAvailable(id)) return;
    setThemeIdState(id);
    AsyncStorage.setItem(THEME_STORAGE_KEY, id).catch(() => {});
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: getTheme(themeId),
      themeId,
      setThemeId,
      availableThemes: Object.values(THEMES).filter((t) => isThemeAvailable(t.id)),
    }),
    [themeId, setThemeId]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeDefinition {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx.theme;
}
