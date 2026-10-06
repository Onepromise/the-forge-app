import type { ThemeDefinition } from './theme';

/**
 * "Tempered Steel" — the default (free) theme pack.
 * Clean modern game UI on the RoninForge identity. Dark mode only.
 */
export const temperedSteel: ThemeDefinition = {
  id: 'tempered-steel',
  name: 'Tempered Steel',
  tagline: 'Iron surfaces, Bone text, and the Temper Gold hamon line.',
  premium: false,

  // Surfaces
  bg: '#1B1917',
  card: '#211E1B',
  cardAlt: '#23201D',
  deepest: '#141210',
  raised: '#2B2724',
  tabBar: '#1F1C1A',
  // Lines
  line: '#2E2A26',
  lineStrong: '#3A3530',
  // Text
  text: '#EDE4D3',
  text2: '#C9BFAE',
  muted: '#A39A8B',
  // Brand accents
  gold: '#B8862E',
  goldBright: '#D4A24C',
  ember: '#C1502E',
  steel: '#4A6670',

  fonts: {
    cinzel600: 'Cinzel_600SemiBold',
    cinzel700: 'Cinzel_700Bold',
    sans400: 'DMSans_400Regular',
    sans500: 'DMSans_500Medium',
    sans600: 'DMSans_600SemiBold',
    sans700: 'DMSans_700Bold',
    mono400: 'DMMono_400Regular',
    mono500: 'DMMono_500Medium',
  },

  radius: 6,
  cardRadius: 6,
  chipRadius: 16,
  buttonRadius: 4,

  // Life-area palette — muted tones that sit on Iron
  areaPalette: ['#C9A24A', '#C46A5A', '#5F8A96', '#D2643A', '#8A7BB0', '#7E9468'],

  // Rank ladder: ash → steel → bone → gold → ember → crimson
  rankStyle: {
    D: { stroke: '#8A8378', fill: '#1B1917', text: '#B5AC9E' },
    C: { stroke: '#5F8A96', fill: '#1B1917', text: '#9FBDC6' },
    B: { stroke: '#EDE4D3', fill: '#1B1917', text: '#EDE4D3' },
    A: { stroke: '#D4A24C', fill: '#2A2112', text: '#D4A24C' },
    S: { stroke: '#C1502E', fill: '#2C1A13', text: '#EE8A66' },
    SS: { stroke: '#E03131', fill: '#2C100D', text: '#EDE4D3' },
  },
};
