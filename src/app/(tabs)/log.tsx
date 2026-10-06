import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../lib/store';
import { coinsForRank, fmt, toDayKey } from '../../lib/types';
import { useTheme } from '../../lib/theme';

interface Entry {
  key: string;
  date: Date;
  title: string;
  sub: string;
  delta: string;
  deltaColor: string;
}

/** Screen — Log: hand-in + redemption history timeline. */
export default function LogScreen() {
  const theme = useTheme();
  const { state } = useStore();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: theme.bg },
        header: { paddingHorizontal: 20, paddingTop: 14 },
        countLine: {
          fontFamily: theme.fonts.mono500,
          fontSize: 11,
          letterSpacing: 2,
          color: theme.muted,
          marginBottom: 6,
        },
        title: {
          fontFamily: theme.fonts.cinzel600,
          fontSize: 28,
          letterSpacing: 1.5,
          color: theme.text,
        },
        list: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#2B2724',
        },
        diamond: {
          width: 6,
          height: 6,
          transform: [{ rotate: '45deg' }],
          backgroundColor: theme.gold,
        },
        middle: { flex: 1, minWidth: 0 },
        rowTitle: { fontFamily: theme.fonts.sans400, fontSize: 14, color: theme.text2 },
        rowSub: { fontFamily: theme.fonts.mono500, fontSize: 12, color: theme.muted, marginTop: 2 },
        delta: { fontFamily: theme.fonts.mono500, fontSize: 12, minWidth: 64, textAlign: 'right' },
        empty: {
          fontFamily: theme.fonts.sans400,
          fontSize: 14,
          color: theme.muted,
          textAlign: 'center',
          marginTop: 32,
        },
      }),
    [theme]
  );

  const realmById = useMemo(() => new Map(state.realms.map((r) => [r.id, r])), [state.realms]);

  const entries: Entry[] = useMemo(() => {
    const list: Entry[] = [];
    for (const q of state.quests) {
      if (!q.done || !q.completedAt) continue;
      const d = new Date(q.completedAt);
      if (Number.isNaN(d.getTime())) continue;
      const realm = realmById.get(q.realmId);
      list.push({
        key: `q-${q.id}`,
        date: d,
        title: q.name,
        sub: `${realm?.name ?? 'Area'} · ${formatWhen(d)}`,
        delta: `+${fmt(coinsForRank(q.rank))}`,
        deltaColor: theme.text,
      });
    }
    for (const r of state.redemptions) {
      const d = new Date(r.date);
      if (Number.isNaN(d.getTime())) continue;
      const realm = realmById.get(r.realmId);
      list.push({
        key: `r-${r.id}`,
        date: d,
        title: `Redeemed ${r.rewardName}`,
        sub: `${realm?.name ?? 'Area'} · ${formatWhen(d)}`,
        delta: `−${fmt(r.cost)} Ryō`,
        deltaColor: theme.goldBright,
      });
    }
    return list.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [state.quests, state.redemptions, realmById, theme]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.countLine}>{entries.length} EVENTS</Text>
        <Text style={styles.title}>Log</Text>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {entries.map((e) => (
          <View key={e.key} style={styles.row}>
            <View style={styles.diamond} />
            <View style={styles.middle}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {e.title}
              </Text>
              <Text style={styles.rowSub}>{e.sub}</Text>
            </View>
            <Text style={[styles.delta, { color: e.deltaColor }]}>{e.delta}</Text>
          </View>
        ))}
        {entries.length === 0 ? (
          <Text style={styles.empty}>Nothing handed in yet. Your history will live here.</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

function formatWhen(d: Date): string {
  const now = new Date();
  if (toDayKey(d) === toDayKey(now)) return 'Today';
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  if (toDayKey(d) === toDayKey(y)) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
