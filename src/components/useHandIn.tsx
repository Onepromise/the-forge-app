import React, { useCallback, useState } from 'react';
import { Quest, areaXp, coinsForRank, fmt, levelForXp } from '../lib/types';
import { useStore } from '../lib/store';
import { Celebration, CelebrationData } from './Celebration';

/**
 * Shared hand-in flow: toggles the quest, computes level-up, and shows the
 * celebration overlay. Render `overlay` at the root of any screen that
 * hands in quests.
 */
export function useHandIn() {
  const { state, toggleQuest } = useStore();
  const [celebration, setCelebration] = useState<CelebrationData | null>(null);

  const handIn = useCallback(
    (quest: Quest) => {
      if (quest.done) {
        // Un-completing: no celebration, just toggle back.
        toggleQuest(quest.id);
        return;
      }
      const realm = state.realms.find((r) => r.id === quest.realmId);
      const before = levelForXp(areaXp(state, quest.realmId));
      const result = toggleQuest(quest.id);
      if (!result || !result.completed) return;
      const coins = result.coins;
      const after = levelForXp(areaXp(state, quest.realmId) + coins);
      const levelUp = after.level > before.level;
      const oldPct = before.xpForNext > 0 ? before.xpInto / before.xpForNext : 0;
      const gainPct =
        before.xpForNext > 0
          ? Math.min(coins, before.xpForNext - before.xpInto) / before.xpForNext
          : 0;
      setCelebration({
        rank: quest.rank,
        title: quest.name,
        xp: coins,
        areaName: realm?.name ?? 'Area',
        areaColor: realm?.color ?? '#B8862E',
        level: before.level,
        oldPct,
        gainPct,
        newXpLabel: `${fmt(Math.min(before.xpInto + coins, before.xpForNext))} / ${fmt(before.xpForNext)}`,
        levelUp,
        nextLevel: after.level,
        ryo: coins,
      });
    },
    [state, toggleQuest]
  );

  const overlay = celebration ? (
    <Celebration data={celebration} onDismiss={() => setCelebration(null)} />
  ) : null;

  return { handIn, overlay };
}
