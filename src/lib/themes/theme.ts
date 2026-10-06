import type { Rank } from '../types';

/**
 * A theme pack: everything visual about the app in one swappable object.
 * Adding a new purchasable theme pack later = adding one ThemeDefinition
 * to the registry. No refactoring, no component changes.
 */
export interface RankBadgeStyle {
  stroke: string;
  fill: string;
  text: string;
}

export interface ThemeFonts {
  cinzel600: string;
  cinzel700: string;
  sans400: string;
  sans500: string;
  sans600: string;
  sans700: string;
  mono400: string;
  mono500: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  tagline: string;
  /**
   * false = free/included with the app; true = paid pack.
   * Paid packs are gated by isThemeAvailable() — wired to store
   * entitlements when the theme store ships.
   */
  premium: boolean;
  // Surfaces
  bg: string;
  card: string;
  cardAlt: string;
  deepest: string;
  raised: string;
  /** Bottom tab bar background. */
  tabBar: string;
  // Lines
  line: string;
  lineStrong: string;
  // Text
  text: string;
  text2: string;
  muted: string;
  // Brand accents
  gold: string;
  goldBright: string;
  ember: string;
  steel: string;
  // Type
  fonts: ThemeFonts;
  // Shape
  radius: number;
  cardRadius: number;
  chipRadius: number;
  buttonRadius: number;
  // Content
  areaPalette: string[];
  rankStyle: Record<Rank, RankBadgeStyle>;
}

/** Hexagon geometry shared by all themes (28x32 viewBox). */
export const HEX_POINTS = '14,1.5 26.5,8.75 26.5,23.25 14,30.5 1.5,23.25 1.5,8.75';

/** Inner decorative hexagon used on the level crest. */
export const HEX_POINTS_INNER = '14,3.5 24.7,9.75 24.7,22.25 14,28.5 3.3,22.25 3.3,9.75';
