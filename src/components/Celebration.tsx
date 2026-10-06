import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { Rank, fmt } from '../lib/types';
import { HEX_POINTS, HEX_POINTS_INNER, useTheme } from '../lib/theme';
import { TabIcon } from './TabIcon';

export interface CelebrationData {
  rank: Rank;
  title: string;
  xp: number;
  areaName: string;
  areaColor: string;
  level: number;
  /** 0..1 progress before this hand-in */
  oldPct: number;
  /** 0..1 fraction of the bar filled by this hand-in (capped at the remainder) */
  gainPct: number;
  newXpLabel: string;
  levelUp: boolean;
  nextLevel: number;
  ryo: number;
}

interface Props {
  data: CelebrationData;
  onDismiss: () => void;
}

/** Full-screen hand-in reward moment: seal stamp, XP count-up, bar fill, Ryō. */
export function Celebration({ data, onDismiss }: Props) {
  const theme = useTheme();
  const t = useRef(new Animated.Value(0)).current;
  const fillW = useRef(new Animated.Value(0)).current;
  const [xpShown, setXpShown] = useState(0);
  const dismissed = useRef(false);

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    onDismiss();
  };

  useEffect(() => {
    const seq = Animated.timing(t, {
      toValue: 1,
      duration: 2600,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    seq.start();
    const fill = Animated.timing(fillW, {
      toValue: 1,
      duration: 700,
      delay: 950,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    fill.start();
    // XP count-up starting at ~0.6s
    const countTimer = setTimeout(() => {
      const t0 = Date.now();
      const dur = 600;
      const id = setInterval(() => {
        const p = Math.min(1, (Date.now() - t0) / dur);
        setXpShown(Math.round(data.xp * (1 - Math.pow(1 - p, 3))));
        if (p >= 1) clearInterval(id);
      }, 30);
    }, 600);
    const auto = setTimeout(dismiss, data.levelUp ? 3400 : 2700);
    return () => {
      seq.stop();
      fill.stop();
      clearTimeout(countTimer);
      clearTimeout(auto);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          ...StyleSheet.absoluteFill,
          backgroundColor: 'rgba(14,13,12,0.92)',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          paddingHorizontal: 36,
          zIndex: 50,
        },
        seal: { width: 120, height: (120 * 32) / 28 },
        sealCenter: {
          ...StyleSheet.absoluteFill,
          alignItems: 'center',
          justifyContent: 'center',
        },
        sealLetter: { fontFamily: theme.fonts.cinzel700, fontSize: 44 },
        kicker: {
          fontFamily: theme.fonts.mono500,
          fontSize: 11,
          letterSpacing: 3,
          color: theme.muted,
        },
        title: {
          fontFamily: theme.fonts.sans600,
          fontSize: 19,
          lineHeight: 25,
          color: theme.text,
          textAlign: 'center',
        },
        xp: { fontFamily: theme.fonts.cinzel700, fontSize: 46, color: theme.goldBright },
        barBlock: { width: '100%', gap: 8 },
        barLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
        barLabel: { fontFamily: theme.fonts.mono500, fontSize: 12, color: theme.text2 },
        track: {
          height: 6,
          backgroundColor: theme.line,
          borderRadius: 1,
          overflow: 'hidden',
        },
        oldFill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
        gainFill: {
          position: 'absolute',
          top: 0,
          bottom: 0,
          backgroundColor: theme.goldBright,
        },
        ryoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
        ryoText: { fontFamily: theme.fonts.mono500, fontSize: 13, color: theme.text2 },
        levelUp: { alignItems: 'center', gap: 6, marginTop: 8 },
        levelLine: { height: 1, width: 200, backgroundColor: theme.gold, opacity: 0.7 },
        levelText: {
          fontFamily: theme.fonts.cinzel600,
          fontSize: 22,
          letterSpacing: 2,
          color: theme.text,
        },
      }),
    [theme]
  );

  const rise = (from: number, to: number) => ({
    opacity: t.interpolate({ inputRange: [from, to], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [
      {
        translateY: t.interpolate({
          inputRange: [from, to],
          outputRange: [14, 0],
          extrapolate: 'clamp',
        }),
      },
    ] as const,
  });

  const sealScale = t.interpolate({
    inputRange: [0.04, 0.22, 0.28],
    outputRange: [1.8, 0.94, 1],
    extrapolate: 'clamp',
  });
  const sealRotate = t.interpolate({
    inputRange: [0.04, 0.25],
    outputRange: ['-8deg', '0deg'],
    extrapolate: 'clamp',
  });
  const sealOpacity = t.interpolate({
    inputRange: [0.04, 0.1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const fillWidth = fillW.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${Math.max(0.5, data.gainPct * 100)}%`],
  });

  const rs = theme.rankStyle[data.rank];
  const sealSize = 120;
  const sealH = (sealSize * 32) / 28;

  return (
    <Pressable style={styles.overlay} onPress={dismiss}>
      <Animated.View
        style={[
          styles.seal,
          {
            opacity: sealOpacity,
            transform: [{ scale: sealScale }, { rotate: sealRotate }],
          },
        ]}
      >
        <Svg width={sealSize} height={sealH} viewBox="0 0 28 32">
          <Polygon points={HEX_POINTS} fill={rs.fill} stroke={rs.stroke} strokeWidth={0.9} />
          <Polygon points={HEX_POINTS_INNER} fill="none" stroke={rs.stroke} strokeWidth={0.3} />
        </Svg>
        <View style={styles.sealCenter}>
          <Text style={[styles.sealLetter, { color: rs.text }]}>{data.rank}</Text>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.kicker, rise(0.17, 0.25)]}>QUEST COMPLETE</Animated.Text>
      <Animated.Text style={[styles.title, rise(0.19, 0.27)]} numberOfLines={2}>
        {data.title}
      </Animated.Text>
      <Animated.Text style={[styles.xp, rise(0.23, 0.31)]}>+{fmt(xpShown)} XP</Animated.Text>

      <Animated.View style={[styles.barBlock, rise(0.27, 0.35)]}>
        <View style={styles.barLabelRow}>
          <Text style={styles.barLabel}>
            {data.areaName.toUpperCase()} · LV {data.level}
          </Text>
          <Text style={styles.barLabel}>{data.newXpLabel}</Text>
        </View>
        <View style={styles.track}>
          <View
            style={[
              styles.oldFill,
              { width: `${data.oldPct * 100}%`, backgroundColor: data.areaColor },
            ]}
          />
          <Animated.View
            style={[styles.gainFill, { width: fillWidth, left: `${data.oldPct * 100}%` }]}
          />
        </View>
      </Animated.View>

      <Animated.View style={[styles.ryoRow, rise(0.33, 0.41)]}>
        <TabIcon name="ryo" size={16} color={theme.gold} strokeWidth={1.8} />
        <Text style={styles.ryoText}>+{fmt(data.ryo)} Ryō</Text>
      </Animated.View>

      {data.levelUp ? (
        <Animated.View style={[styles.levelUp, rise(0.62, 0.7)]}>
          <View style={styles.levelLine} />
          <Text style={styles.levelText}>LEVEL {data.nextLevel}</Text>
        </Animated.View>
      ) : null}
    </Pressable>
  );
}
