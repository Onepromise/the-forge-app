/**
 * Theme system entry point.
 *
 * Themes are swappable packs: `useTheme()` returns the active
 * ThemeDefinition, and adding a new purchasable pack later is just adding
 * one object to the registry in `./themes/registry.ts`.
 */
export { useTheme, ThemeProvider } from './themes/ThemeProvider';
export {
  THEMES,
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  getTheme,
  listThemes,
  isThemeAvailable,
} from './themes/registry';
export { HEX_POINTS, HEX_POINTS_INNER } from './themes/theme';
export type { ThemeDefinition, ThemeFonts, RankBadgeStyle } from './themes/theme';
