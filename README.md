# The Forge ⚔️

A gamified life-management app on the RoninForge identity. Complete quests,
earn XP and Ryō, spend Ryō on guilt-free rest. *Temper the path, one quest
at a time.*

Built with Expo (React Native + TypeScript) + Expo Router. One codebase runs
on iOS, Android, and web. Data persists locally via AsyncStorage.

## Run it

```bash
cd ~/workspace/questboard-app
npx expo start          # scan QR with Expo Go, or press w for web
npx expo start --web    # web only
```

Typecheck: `npx tsc --noEmit`

## How it works

- **Life Areas** (realms) = life areas (Health, Learning…). Each has an XP
  level and a Ryō wallet.
- **Quests** = tasks, each with a difficulty rank: SS, S, A, B, C, D.
- Handing in a quest earns XP (toward the area's level) and Ryō:
  D=10, C=25, B=50, A=100, S=200, SS=500.
- **Reward Shop** (Character tab): user-defined rewards with Ryō costs.
  Redeeming deducts from the wallet and logs to history.
- Currency is called **Ryō**.

## Theme packs

The app is free; purchasable theme packs will be the only paid feature.
All visuals live in swappable theme modules — no component changes needed
to ship a new pack:

- `src/lib/themes/theme.ts` — `ThemeDefinition` interface
- `src/lib/themes/temperedSteel.ts` — the default (free) theme
- `src/lib/themes/registry.ts` — pack registry; **adding a new purchasable
  pack = adding one entry here**
- `src/lib/themes/ThemeProvider.tsx` — `ThemeProvider` + `useTheme()`
  (persists the selected pack; paid packs gate on `isThemeAvailable()`,
  wired to store entitlements when the theme store ships)

## Files

- `src/lib/types.ts` — data model, ranks, coin values, wallet/XP/level math
- `src/lib/seed.ts` — sample data
- `src/lib/store.tsx` — state + AsyncStorage persistence
- `src/lib/themes/` — theme-pack system (see above)
- `src/app/enter.tsx` — welcome screen
- `src/app/(tabs)/index.tsx` — Life Areas home
- `src/app/(tabs)/quests.tsx` — Quest Log + hand-in + add/edit sheet
- `src/app/(tabs)/log.tsx` — hand-in + redemption history
- `src/app/(tabs)/character.tsx` — Character Sheet + Reward Shop
- `src/app/area/[id].tsx` — Life Area detail
- `src/components/` — HexBadge, XpBar (hamon tick), QuestRow, AreaRow,
  Celebration, QuestSheet, RealmSheet, RewardSheet, ForgeButton, Chip,
  TabIcon, ForgeTabBar, useHandIn

## TODO / next iteration

- Quest due-date reminders / notifications
- Cloud sync (Supabase/Firebase) for multi-device
- EAS build profiles for TestFlight / Play Store
- Theme store UI + IAP (architecture is ready)
- Radar chart on the Character sheet (in the design doc, skipped)
- Daily-quest auto reset
