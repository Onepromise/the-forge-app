import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../lib/theme';
import { ENTERED_KEY } from './index';

/** Welcome / enter screen (screen 01). No auth — local app, stores an entered flag. */
export default function EnterScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: theme.deepest },
        content: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 32,
        },
        brand: { alignItems: 'center', gap: 14 },
        emblem: { width: 112, height: 112 },
        title: {
          fontFamily: theme.fonts.cinzel600,
          fontSize: 34,
          letterSpacing: 4,
          color: theme.text,
          marginTop: 6,
        },
        rule: { height: 1, width: 200, backgroundColor: theme.gold, opacity: 0.8 },
        tagline: { fontFamily: theme.fonts.sans400, fontSize: 15, color: theme.text2 },
        button: {
          width: '100%',
          height: 54,
          backgroundColor: theme.ember,
          borderRadius: theme.buttonRadius,
          alignItems: 'center',
          justifyContent: 'center',
        },
        pressed: { opacity: 0.85 },
        buttonText: {
          fontFamily: theme.fonts.sans600,
          fontSize: 16,
          letterSpacing: 0.2,
          color: theme.text,
        },
      }),
    [theme]
  );

  const enter = async () => {
    try {
      await AsyncStorage.setItem(ENTERED_KEY, '1');
    } catch {
      // non-fatal
    }
    router.replace('/(tabs)/areas');
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[theme.cardAlt, theme.bg, theme.deepest]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.content, { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.brand}>
          <Image
            source={require('../../assets/images/emblem.png')}
            style={styles.emblem}
            resizeMode="contain"
          />
          <Text style={styles.title}>THE FORGE</Text>
          <View style={styles.rule} />
          <Text style={styles.tagline}>Temper the path, one quest at a time.</Text>
        </View>
        <Pressable onPress={enter} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Enter the Forge</Text>
        </Pressable>
      </View>
    </View>
  );
}
