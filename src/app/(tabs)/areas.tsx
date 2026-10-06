import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../../lib/store';
import { areaXp, coinsForRank, fmt, levelForXp, streakDays, toDayKey } from '../../lib/types';
import { useTheme } from '../../lib/theme';
import { INSTALL_KEY } from '../index';
import { AreaRow } from '../../components/AreaRow';
import { RealmSheet } from '../../components/RealmSheet';
import { TabIcon } from '../../components/TabIcon';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function dayHeader(dayCount: number): string {
  const now = new Date();
  return `${WEEKDAYS[now.getDay()]} · ${MONTHS[now.getMonth()]} ${now.getDate()} · DAY ${dayCount}`;
}

/** Screen 02 — Life Areas home. */
export default function AreasScreen() {
  const theme = useTheme();
  const { state, addRealm } = useStore();
  const insets = useSafeAreaInsets();
  const [dayCount, setDayCount] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(INSTALL_KEY);
        if (raw) {
          const install = new Date(raw);
          const diff = Math.floor((Date.now() - install.getTime()) / 86400000) + 1;
          setDayCount(Math.max(1, diff));
        }
      } catch {
        // keep default
      }
    })();
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: theme.bg },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingHorizontal: 20,
          paddingTop: 14,
        },
        dayLine: {
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
        addBtn: {
          width: 40,
          height: 40,
          borderWidth: 1,
          borderColor: theme.lineStrong,
          borderRadius: theme.buttonRadius,
          alignItems: 'center',
          justifyContent: 'center',
        },
        body: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
        summary: {
          marginTop: 18,
          padding: 14,
          backgroundColor: theme.cardAlt,
          borderWidth: 1,
          borderColor: theme.line,
          borderRadius: theme.cardRadius,
          gap: 10,
        },
        summaryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
        summaryText: { fontFamily: theme.fonts.sans600, fontSize: 15, color: theme.text },
        summaryXp: { fontFamily: theme.fonts.mono500, fontSize: 13, color: theme.goldBright },
        pips: { flexDirection: 'row', gap: 4 },
        pip: { flex: 1, height: 4, borderRadius: 1 },
        streakRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
        streakText: { fontFamily: theme.fonts.sans500, fontSize: 12, color: theme.text2 },
        areas: { gap: 8 },
      }),
    [theme]
  );

  const todayKey = toDayKey(new Date());
  const doneToday = state.quests.filter(
    (q) => q.done && q.completedAt && toDayKey(new Date(q.completedAt)) === todayKey
  );
  const todayXp = doneToday.reduce((s, q) => s + coinsForRank(q.rank), 0);
  const streak = streakDays(state.quests.map((q) => q.completedAt));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.dayLine}>{dayHeader(dayCount)}</Text>
          <Text style={styles.title}>Life Areas</Text>
        </View>
        <Pressable
          onPress={() => setSheetOpen(true)}
          style={styles.addBtn}
          hitSlop={8}
          accessibilityLabel="Add life area"
        >
          <TabIcon name="add" size={20} color={theme.text} strokeWidth={1.5} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.summary}>
          <View style={styles.summaryTop}>
            <Text style={styles.summaryText}>
              {doneToday.length} of {state.quests.length} quests handed in
            </Text>
            <Text style={styles.summaryXp}>+{fmt(todayXp)} XP</Text>
          </View>
          <View style={styles.pips}>
            {state.quests.map((q) => (
              <View
                key={q.id}
                style={[styles.pip, { backgroundColor: q.done ? theme.gold : '#34302B' }]}
              />
            ))}
          </View>
          <View style={styles.streakRow}>
            <TabIcon name="flame" size={14} color={theme.ember} strokeWidth={2} />
            <Text style={styles.streakText}>
              {streak}-day streak{streak === 1 ? '' : 's'}
            </Text>
          </View>
        </View>

        <View style={styles.areas}>
          {state.realms.map((realm) => {
            const xp = areaXp(state, realm.id);
            const lv = levelForXp(xp);
            return (
              <AreaRow
                key={realm.id}
                realm={realm}
                level={lv.level}
                xpInto={lv.xpInto}
                xpForNext={lv.xpForNext}
                onPress={() => router.push(`/area/${realm.id}`)}
              />
            );
          })}
        </View>
      </ScrollView>

      <RealmSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSave={(name, color) => addRealm(name, '', color)}
      />
    </View>
  );
}
