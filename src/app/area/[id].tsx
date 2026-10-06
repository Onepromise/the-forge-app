import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polygon } from 'react-native-svg';
import { useStore } from '../../lib/store';
import {
  areaXp,
  coinsForRank,
  fmt,
  levelForXp,
  streakDays,
  toDayKey,
} from '../../lib/types';
import { HEX_POINTS, HEX_POINTS_INNER, useTheme } from '../../lib/theme';
import { QuestRow } from '../../components/QuestRow';
import { RealmSheet } from '../../components/RealmSheet';
import { TabIcon } from '../../components/TabIcon';
import { XpBar } from '../../components/XpBar';
import { useHandIn } from '../../components/useHandIn';

const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Screen 03 — Life Area Detail. */
export default function AreaDetailScreen() {
  const theme = useTheme();
  const { state, renameRealm } = useStore();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { handIn, overlay } = useHandIn();
  const [renameOpen, setRenameOpen] = useState(false);

  const realm = state.realms.find((r) => r.id === id);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: theme.bg },
        topBar: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          height: 44,
        },
        topLabel: {
          fontFamily: theme.fonts.mono500,
          fontSize: 11,
          letterSpacing: 2,
          color: theme.muted,
        },
        edit: { fontFamily: theme.fonts.sans500, fontSize: 14, color: theme.goldBright },
        body: { paddingBottom: 32 },
        crestRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 18,
          paddingHorizontal: 20,
          paddingTop: 10,
        },
        crestCenter: {
          ...StyleSheet.absoluteFill,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        },
        crestKicker: {
          fontFamily: theme.fonts.mono500,
          fontSize: 9,
          letterSpacing: 2,
          color: theme.muted,
        },
        crestLevel: { fontFamily: theme.fonts.cinzel700, fontSize: 38, lineHeight: 40, color: theme.text },
        nameCol: { flex: 1, gap: 10 },
        name: {
          fontFamily: theme.fonts.cinzel600,
          fontSize: 28,
          letterSpacing: 1,
          color: theme.text,
        },
        xpLine: { fontFamily: theme.fonts.mono500, fontSize: 12, color: theme.muted },
        stats: {
          marginHorizontal: 20,
          marginTop: 22,
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: theme.line,
          borderRadius: theme.cardRadius,
          backgroundColor: theme.card,
        },
        stat: { flex: 1, padding: 12, gap: 4 },
        statBorder: { borderRightWidth: 1, borderRightColor: theme.line },
        statLabel: {
          fontFamily: theme.fonts.mono500,
          fontSize: 10,
          letterSpacing: 2,
          color: theme.muted,
        },
        statValue: { fontFamily: theme.fonts.sans600, fontSize: 20, color: theme.text },
        section: { marginTop: 22, paddingHorizontal: 20, gap: 8 },
        sectionLabel: {
          fontFamily: theme.fonts.mono500,
          fontSize: 11,
          letterSpacing: 2,
          color: theme.muted,
          marginBottom: 4,
        },
        weekRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
        weekTotal: { fontFamily: theme.fonts.mono500, fontSize: 13, color: theme.text },
        bars: { flexDirection: 'row', gap: 8, height: 84, alignItems: 'flex-end' },
        barCol: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center', gap: 6 },
        bar: { width: '100%', borderRadius: 1 },
        barLabel: { fontFamily: theme.fonts.mono500, fontSize: 10 },
        histRow: {
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
        histTitle: { flex: 1, fontFamily: theme.fonts.sans400, fontSize: 14, color: theme.text2 },
        histWhen: { fontFamily: theme.fonts.mono500, fontSize: 12, color: theme.muted },
        histXp: {
          fontFamily: theme.fonts.mono500,
          fontSize: 12,
          color: theme.text,
          width: 44,
          textAlign: 'right',
        },
        missing: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 32,
        },
        missingText: { fontFamily: theme.fonts.sans500, fontSize: 15, color: theme.muted },
      }),
    [theme]
  );

  const areaQuests = useMemo(
    () => (realm ? state.quests.filter((q) => q.realmId === realm.id) : []),
    [state.quests, realm]
  );
  const activeQuests = useMemo(
    () => [...areaQuests].sort((a, b) => Number(a.done) - Number(b.done)),
    [areaQuests]
  );
  const history = useMemo(
    () =>
      areaQuests
        .filter((q) => q.done && q.completedAt)
        .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
        .slice(0, 10),
    [areaQuests]
  );

  const week = useMemo(() => {
    const days: { key: string; label: string; xp: number; isToday: boolean }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = toDayKey(d);
      const xp = areaQuests
        .filter((q) => q.done && q.completedAt && toDayKey(new Date(q.completedAt)) === key)
        .reduce((s, q) => s + coinsForRank(q.rank), 0);
      days.push({ key, label: DAY_INITIALS[d.getDay()], xp, isToday: i === 0 });
    }
    return days;
  }, [areaQuests]);
  const weekXp = week.reduce((s, d) => s + d.xp, 0);
  const weekMax = Math.max(1, ...week.map((d) => d.xp));

  if (!realm) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.missing}>
          <Text style={styles.missingText}>This area no longer exists.</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.edit}>Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const xp = areaXp(state, realm.id);
  const lv = levelForXp(xp);
  const progress = lv.xpForNext > 0 ? lv.xpInto / lv.xpForNext : 0;
  const toNext = lv.xpForNext - lv.xpInto;
  const handedIn = areaQuests.filter((q) => q.done).length;
  const streak = streakDays(areaQuests.map((q) => q.completedAt));
  const crestSize = 96;
  const crestH = (crestSize * 32) / 28;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <TabIcon name="back" size={24} color={theme.text} strokeWidth={1.8} />
        </Pressable>
        <Text style={styles.topLabel}>LIFE AREA</Text>
        <Pressable onPress={() => setRenameOpen(true)} hitSlop={12}>
          <Text style={styles.edit}>Edit</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.crestRow}>
          <View style={{ width: crestSize, height: crestH }}>
            <View style={StyleSheet.absoluteFill}>
              <Svg width={crestSize} height={crestH} viewBox="0 0 28 32">
                <Polygon
                  points={HEX_POINTS}
                  fill={theme.bg}
                  stroke={realm.color}
                  strokeWidth={0.9}
                />
                <Polygon
                  points={HEX_POINTS_INNER}
                  fill="none"
                  stroke={theme.gold}
                  strokeWidth={0.3}
                />
              </Svg>
            </View>
            <View style={styles.crestCenter}>
              <Text style={styles.crestKicker}>LEVEL</Text>
              <Text style={styles.crestLevel}>{lv.level}</Text>
            </View>
          </View>
          <View style={styles.nameCol}>
            <Text style={styles.name}>{realm.name}</Text>
            <XpBar progress={progress} color={realm.color} />
            <Text style={styles.xpLine}>
              {fmt(lv.xpInto)} / {fmt(lv.xpForNext)} · {fmt(toNext)} to Lv {lv.level + 1}
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={[styles.stat, styles.statBorder]}>
            <Text style={styles.statLabel}>TOTAL XP</Text>
            <Text style={styles.statValue}>{fmt(xp)}</Text>
          </View>
          <View style={[styles.stat, styles.statBorder]}>
            <Text style={styles.statLabel}>HANDED IN</Text>
            <Text style={styles.statValue}>{handedIn}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>STREAK</Text>
            <Text style={styles.statValue}>{streak}d</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.weekRow}>
            <Text style={styles.sectionLabel}>THIS WEEK</Text>
            <Text style={styles.weekTotal}>{fmt(weekXp)} XP</Text>
          </View>
          <View style={styles.bars}>
            {week.map((d) => (
              <View key={d.key} style={styles.barCol}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max(4, (d.xp / weekMax) * 100)}%`,
                      backgroundColor: d.isToday ? theme.gold : realm.color,
                      opacity: d.xp === 0 ? 0.25 : 1,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.barLabel,
                    { color: d.isToday ? theme.goldBright : theme.muted },
                  ]}
                >
                  {d.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            ACTIVE QUESTS · {areaQuests.filter((q) => !q.done).length}
          </Text>
          {activeQuests.map((q) => (
            <QuestRow
              key={q.id}
              quest={q}
              areaName={realm.name}
              areaColor={realm.color}
              onHandIn={() => handIn(q)}
            />
          ))}
          {activeQuests.length === 0 ? (
            <Text style={styles.histWhen}>No quests in this area yet.</Text>
          ) : null}
        </View>

        {history.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>HISTORY</Text>
            {history.map((q) => (
              <View key={q.id} style={styles.histRow}>
                <View style={styles.diamond} />
                <Text style={styles.histTitle} numberOfLines={1}>
                  {q.name}
                </Text>
                <Text style={styles.histWhen}>{formatWhen(new Date(q.completedAt!))}</Text>
                <Text style={styles.histXp}>+{fmt(coinsForRank(q.rank))}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <RealmSheet
        visible={renameOpen}
        onClose={() => setRenameOpen(false)}
        initial={realm}
        onSave={(name) => renameRealm(realm.id, name)}
      />

      {overlay}
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
