import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../lib/theme';

interface Props {
  /** 0..1 */
  progress: number;
  /** Fill color — the life area's color. */
  color: string;
  height?: number;
}

/**
 * The XP bar: 6px blade filled with the area color, with the gold hamon
 * tick marking the progress point.
 */
export function XpBar({ progress, color, height = 6 }: Props) {
  const theme = useTheme();
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ height, backgroundColor: theme.raised, borderRadius: 1 }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${p * 100}%`,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: `${p * 100}%`,
          top: -3,
          width: 2,
          height: 12,
          marginLeft: -1,
          backgroundColor: theme.gold,
        }}
      />
    </View>
  );
}
