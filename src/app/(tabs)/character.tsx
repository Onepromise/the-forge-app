import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../lib/store';
import {
  RANKS,
  areaXp,
  fmt,
  levelForXp,
  realmBalance,
  streakDays,
} from '../../lib/types';
import { useTheme } from '../../lib/theme';
import { AreaRow } from '../../components/AreaRow';
import { RewardSheet } from '../../components/RewardSheet';
import { TabIcon } from '../../components/TabIcon';

/** Screen 06 — Character Sheet + Reward Shop. */
export default function CharacterScreen() {
  const theme = useTheme();
  const { state, balance, addReward, redeemReward } = useStore();
  const insets = useSafeAreaInsets();
  const [rewardSheetOpen, setRewardSheetOpen] = useState(false);
  const [arming, setArming] = useState<string | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: theme.bg },
        body: { paddingBottom: 24 },
        head: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          paddingHorizontal: 20,
          paddingTop: 14,
        },
        emblem: { width: 72, height: 72 },
        headText: { flex: 1, gap: 4 },
        name: { fontFamily: theme.fonts.cinzel600, fontSize: 24, letterSpacing: 1, color: theme.text },
        sub: { fontFamily: theme.fonts.sans500, fontSize: 13, color: theme.text2 },
        ryoChip: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          height: 32,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: theme.lineStrong,
          borderRadius: 16,
        },
        ryoText: { fontFamily: theme.fonts.mono500, fontSize: 13, color: theme.text },
        divider: {
          height: 1,
          marginHorizontal: 20,
          marginTop: 18,
          backgroundColor: theme.gold,
          opacity: 0.5,
        },
        stats: {
          marginHorizontal: 20,
          marginTop: 18,
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
        section: { marginTop: 18, paddingHorizontal: 20, gap: 8 },
        sectionLabel: {
          fontFamily: theme.fonts.mono500,
          fontSize: 11,
          letterSpacing: 2,
          color: theme.muted,
          marginBottom: 6,
        },
        rankRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
        rankLetter: { width: 22, fontFamily: theme.fonts.cinzel700, fontSize: 12 },
        rankTrack: { flex: 1, height: 4, backgroundColor: theme.raised, borderRadius: 1 },
        rankCount: {
          width: 40,
          textAlign: 'right',
          fontFamily: theme.fonts.mono500,
          fontSize: 12,
          color: theme.text2,
        },
        realmHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginTop: 8,
        },
        realmName: { fontFamily: theme.fonts.sans600, fontSize: 16, color: theme.text },
        realmBal: { fontFamily: theme.fonts.mono500, fontSize: 12, color: theme.goldBright },
        rewardRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: '#2B2724',
          borderRadius: theme.cardRadius,
        },
        rewardBody: { flex: 1, minWidth: 0, gap: 2 },
        rewardName: { fontFamily: theme.fonts.sans600, fontSize: 15, color: theme.text },
        rewardDesc: { fontFamily: theme.fonts.sans400, fontSize: 12, color: theme.muted },
        cost: { fontFamily: theme.fonts.mono500, fontSize: 12, color: theme.goldBright },
        redeemBtn: {
          paddingHorizontal: 14,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: theme.gold,
          borderRadius: theme.buttonRadius,
        },
        redeemArmed: { backgroundColor: theme.gold },
        redeemText: { fontFamily: theme.fonts.sans600, fontSize: 13, color: theme.goldBright },
        redeemTextArmed: { color: theme.bg },
        redeemDisabled: { opacity: 0.35 },
        addReward: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingVertical: 12,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: theme.lineStrong,
          borderRadius: theme.cardRadius,
        },
        addRewardText: { fontFamily: theme.fonts.sans500, fontSize: 14, color: theme.muted },
      }),
    [theme]
  );

  const totalLevel = state.realms.reduce((s, r) => s + levelForXp(areaXp(state, r.id)).level, 0);
  const totalRyo = state.realms.reduce((s, r) => s + realmBalance(state, r.id), 0);
  const handedIn = state.quests.filter((q) => q.done).length;
  const lifetimeXp = state.realms.reduce((s, r) => s + areaXp(state, r.id), 0);
  const bestStreak = Math.max(
    0,
    ...state.realms.map((r) =>
      streakDays(state.quests.filter((q) => q.realmId === r.id).map((q) => q.completedAt))
    )
  );
  const rankCounts = RANKS.map((rank) => ({
    rank,
    n: state.quests.filter((q) => q.rank === rank && q.done).length,
    color: theme.rankStyle[rank].stroke,
  }));
  const maxRank = Math.max(1, ...rankCounts.map((r) => r.n));

  const redeem = (realmId: string, rewardId: string) => {
    if (arming !== rewardId) {
      setArming(rewardId);
      setTimeout(() => setArming((a) => (a === rewardId ? null : a)), 2500);
      return;
    }
    setArming(null);
    redeemReward(realmId, rewardId);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.head}>
          <Image
            source={require('../../../assets/images/emblem.png')}
            style={styles.emblem}
            resizeMode="contain"
          />
          <View style={styles.headText}>
            <Text style={styles.name}>Wilfredo</Text>
            <Text style={styles.sub}>The Ronin · Total Level {totalLevel}</Text>
          </View>
          <View style={styles.ryoChip}>
            <TabIcon name="ryo" size={15} color={theme.gold} strokeWidth={1.8} />
            <Text style={styles.ryoText}>{fmt(totalRyo)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.stats}>
          <View style={[styles.stat, styles.statBorder]}>
            <Text style={styles.statLabel}>HANDED IN</Text>
            <Text style={styles.statValue}>{fmt(handedIn)}</Text>
          </View>
          <View style={[styles.stat, styles.statBorder]}>
            <Text style={styles.statLabel}>BEST STREAK</Text>
            <Text style={styles.statValue}>{bestStreak}d</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>LIFETIME XP</Text>
            <Text style={styles.statValue}>
              {lifetimeXp >= 1000 ? `${(lifetimeXp / 1000).toFixed(1)}k` : fmt(lifetimeXp)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>QUESTS BY RANK</Text>
          {rankCounts.map((r) => (
            <View key={r.rank} style={styles.rankRow}>
              <Text style={[styles.rankLetter, { color: r.color }]}>{r.rank}</Text>
              <View style={styles.rankTrack}>
                <View
                  style={{
                    height: '100%',
                    width: `${(r.n / maxRank) * 100}%`,
                    backgroundColor: r.color,
                    borderRadius: 1,
                  }}
                />
              </View>
              <Text style={styles.rankCount}>{r.n}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>LIFE AREAS</Text>
          {state.realms.map((realm) => {
            const lv = levelForXp(areaXp(state, realm.id));
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

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>REWARD SHOP</Text>
          {state.realms.map((realm) => {
            const rewards = state.rewards.filter((rw) => rw.realmId === realm.id);
            const bal = balance(realm.id);
            return (
              <View key={realm.id} style={{ gap: 8 }}>
                <View style={styles.realmHeader}>
                  <Text style={styles.realmName}>{realm.name}</Text>
                  <Text style={styles.realmBal}>{fmt(bal)} Ryō</Text>
                </View>
                {rewards.map((rw) => {
                  const affordable = bal >= rw.cost;
                  const armed = arming === rw.id;
                  return (
                    <View key={rw.id} style={styles.rewardRow}>
                      <View style={styles.rewardBody}>
                        <Text style={styles.rewardName}>{rw.name}</Text>
                        {rw.description ? (
                          <Text style={styles.rewardDesc} numberOfLines={1}>
                            {rw.description}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={styles.cost}>{fmt(rw.cost)}</Text>
                      <Pressable
                        onPress={() => redeem(realm.id, rw.id)}
                        disabled={!affordable}
                        style={[
                          styles.redeemBtn,
                          armed && styles.redeemArmed,
                          !affordable && styles.redeemDisabled,
                        ]}
                      >
                        <Text style={[styles.redeemText, armed && styles.redeemTextArmed]}>
                          {armed ? 'Sure?' : 'Redeem'}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            );
          })}
          <Pressable style={styles.addReward} onPress={() => setRewardSheetOpen(true)}>
            <TabIcon name="add" size={16} color={theme.muted} strokeWidth={1.8} />
            <Text style={styles.addRewardText}>Add reward</Text>
          </Pressable>
        </View>
      </ScrollView>

      <RewardSheet
        visible={rewardSheetOpen}
        onClose={() => setRewardSheetOpen(false)}
        realms={state.realms}
        onSave={(realmId, name, cost, description) => addReward(realmId, name, cost, description)}
      />
    </View>
  );
}
