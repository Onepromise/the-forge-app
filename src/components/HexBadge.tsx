import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { Rank } from '../lib/types';
import { HEX_POINTS, HEX_POINTS_INNER, useTheme } from '../lib/theme';

interface Props {
  rank: Rank;
  /** Width of the hexagon in px; height follows the 28x32 ratio. */
  size?: number;
  /** Draw the thin inner gold-lined hexagon (level crest style). */
  innerLine?: boolean;
  innerLineColor?: string;
}

/** Rank badge: hexagon with the rank letter set in Cinzel. */
export function HexBadge({ rank, size = 36, innerLine = false, innerLineColor = '#B8862E' }: Props) {
  const theme = useTheme();
  const s = theme.rankStyle[rank];
  const height = (size * 32) / 28;
  const fontSize = Math.round(size * (rank === 'SS' ? 0.3 : 0.4));
  return (
    <View style={{ width: size, height }}>
      <View style={StyleSheet.absoluteFill}>
        <Svg width={size} height={height} viewBox="0 0 28 32">
          <Polygon points={HEX_POINTS} fill={s.fill} stroke={s.stroke} strokeWidth={1.4} />
          {innerLine ? (
            <Polygon
              points={HEX_POINTS_INNER}
              fill="none"
              stroke={innerLineColor}
              strokeWidth={0.3}
            />
          ) : null}
        </Svg>
      </View>
      <View style={styles.center}>
        <Text style={{ fontFamily: theme.fonts.cinzel700, fontSize, color: s.text }}>
          {rank}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
