import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { Realm, fmt } from '../lib/types';
import { HEX_POINTS, useTheme } from '../lib/theme';
import { XpBar } from './XpBar';

interface Props {
  realm: Realm;
  level: number;
  xpInto: number;
  xpForNext: number;
  onPress: () => void;
}

/** Life-area row: level hex, name, XP label, XP bar with hamon tick. */
export function AreaRow({ realm, level, xpInto, xpForNext, onPress }: Props) {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          padding: 12,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: '#2B2724',
          borderRadius: theme.cardRadius,
        },
        hexCenter: {
          ...StyleSheet.absoluteFill,
          alignItems: 'center',
          justifyContent: 'center',
        },
        hexLevel: { fontFamily: theme.fonts.cinzel700, fontSize: 16, color: theme.text },
        body: { flex: 1, minWidth: 0, gap: 9 },
        topRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 8,
        },
        name: { fontFamily: theme.fonts.sans600, fontSize: 16, color: theme.text, flexShrink: 1 },
        xpLabel: { fontFamily: theme.fonts.mono500, fontSize: 12, color: theme.muted },
      }),
    [theme]
  );
  const progress = xpForNext > 0 ? xpInto / xpForNext : 0;
  const hexSize = 40;
  const hexH = (hexSize * 32) / 28;
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={{ width: hexSize, height: hexH }}>
        <View style={StyleSheet.absoluteFill}>
          <Svg width={hexSize} height={hexH} viewBox="0 0 28 32">
            <Polygon
              points={HEX_POINTS}
              fill={theme.bg}
              stroke={realm.color}
              strokeWidth={1.4}
            />
          </Svg>
        </View>
        <View style={styles.hexCenter}>
          <Text style={styles.hexLevel}>{level}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{realm.name}</Text>
          <Text style={styles.xpLabel}>
            {fmt(xpInto)} / {fmt(xpForNext)} XP
          </Text>
        </View>
        <XpBar progress={progress} color={realm.color} />
      </View>
    </Pressable>
  );
}
