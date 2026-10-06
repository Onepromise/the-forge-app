import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Cadence, Quest, coinsForRank, fmt } from '../lib/types';
import { useTheme } from '../lib/theme';
import { HexBadge } from './HexBadge';
import { TabIcon } from './TabIcon';

const CADENCE_LABEL: Record<Cadence, string> = {
  once: 'One-off',
  daily: 'Daily',
  weekly: 'Weekly',
};

interface Props {
  quest: Quest;
  areaName: string;
  areaColor: string;
  onHandIn: () => void;
  onLongPress?: () => void;
}

/** Quest row: rank hex, title, area line, +XP, gold hand-in button. */
export function QuestRow({ quest, areaName, areaColor, onHandIn, onLongPress }: Props) {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 11,
          paddingHorizontal: 12,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: '#2B2724',
          borderRadius: theme.cardRadius,
        },
        rowDone: { opacity: 0.5 },
        middle: { flex: 1, minWidth: 0, gap: 4 },
        title: { fontFamily: theme.fonts.sans600, fontSize: 15, color: theme.text },
        titleDone: { textDecorationLine: 'line-through' },
        sub: { flexDirection: 'row', alignItems: 'center', gap: 6 },
        dot: { width: 7, height: 7, borderRadius: 3.5 },
        subText: { fontFamily: theme.fonts.sans500, fontSize: 12, color: theme.muted },
        xp: { fontFamily: theme.fonts.mono500, fontSize: 12, color: theme.goldBright },
        handIn: {
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: theme.gold,
          borderRadius: theme.buttonRadius,
          backgroundColor: 'transparent',
        },
        handInDone: { backgroundColor: theme.gold, borderColor: theme.gold },
      }),
    [theme]
  );
  const done = quest.done;
  const xp = coinsForRank(quest.rank);
  return (
    <Pressable
      onPress={onHandIn}
      onLongPress={onLongPress}
      delayLongPress={450}
      style={[styles.row, done && styles.rowDone]}
    >
      <HexBadge rank={quest.rank} size={32} />
      <View style={styles.middle}>
        <Text
          style={[styles.title, done && styles.titleDone]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {quest.name}
        </Text>
        <View style={styles.sub}>
          <View style={[styles.dot, { backgroundColor: areaColor }]} />
          <Text style={styles.subText}>
            {areaName} · {CADENCE_LABEL[quest.cadence ?? 'once']}
          </Text>
        </View>
      </View>
      <Text style={styles.xp}>+{fmt(xp)}</Text>
      <View style={[styles.handIn, done && styles.handInDone]}>
        <TabIcon
          name="check"
          size={20}
          color={done ? theme.bg : theme.goldBright}
          strokeWidth={2}
        />
      </View>
    </Pressable>
  );
}
