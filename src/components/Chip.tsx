import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../lib/theme';

interface Props {
  label: string;
  active: boolean;
  onPress: () => void;
}

/** Filter chip: 32px tall, 16px radius. Active = bone fill on iron text. */
export function Chip({ label, active, onPress }: Props) {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          height: 32,
          paddingHorizontal: 14,
          borderRadius: theme.chipRadius,
          alignItems: 'center',
          justifyContent: 'center',
        },
        active: { backgroundColor: theme.text },
        inactive: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.lineStrong,
        },
        label: { fontSize: 13 },
        labelActive: { fontFamily: theme.fonts.sans600, color: theme.bg },
        labelInactive: { fontFamily: theme.fonts.sans500, color: theme.text2 },
      }),
    [theme]
  );
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, active ? styles.active : styles.inactive]}
    >
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}
