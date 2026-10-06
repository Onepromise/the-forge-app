import { temperedSteel } from './temperedSteel';
import type { ThemeDefinition } from './theme';

export const THEME_STORAGE_KEY = '@questboard/theme/v1';
export const DEFAULT_THEME_ID = 'tempered-steel';

/**
 * Theme-pack registry.
 * Shipping a new purchasable theme pack = adding one entry here
 * (plus its entry in the future store catalog). Components never change.
 */
export const THEMES: Record<string, ThemeDefinition> = {
  [temperedSteel.id]: temperedSteel,
};

export function getTheme(id: string): ThemeDefinition {
  return THEMES[id] ?? THEMES[DEFAULT_THEME_ID];
}

export function listThemes(): ThemeDefinition[] {
  return Object.values(THEMES);
}

/**
 * Entitlement gate for the theme store (not built yet).
 * Free packs are always available; paid packs will check the purchase
 * receipt/entitlement here before unlocking.
 */
export function isThemeAvailable(themeId: string): boolean {
  const def = THEMES[themeId];
  if (!def) return false;
  if (!def.premium) return true;
  // TODO(theme-store): verify purchase entitlement for paid packs.
  return false;
}
