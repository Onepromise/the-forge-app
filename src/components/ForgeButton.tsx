import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '../lib/theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean;
}

/** Ember primary / gold-outline secondary buttons. */
export function ForgeButton({ title, onPress, variant = 'primary', style, disabled }: Props) {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        base: {
          minHeight: 54,
          borderRadius: theme.buttonRadius,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 22,
        },
        primary: { backgroundColor: theme.ember },
        secondary: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.gold,
        },
        pressed: { opacity: 0.85 },
        disabled: { opacity: 0.4 },
        label: {
          fontFamily: theme.fonts.sans600,
          fontSize: 16,
          letterSpacing: 0.2,
        },
        labelPrimary: { color: theme.text },
        labelSecondary: { color: theme.goldBright },
      }),
    [theme]
  );
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>
        {title}
      </Text>
    </Pressable>
  );
}
