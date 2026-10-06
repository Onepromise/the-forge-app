import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme';
import { IconName, TabIcon } from './TabIcon';

interface TabDef {
  route: string;
  label: string;
  icon: IconName;
}

const TABS: TabDef[] = [
  { route: 'areas', label: 'Areas', icon: 'areas' },
  { route: 'quests', label: 'Quests', icon: 'quests' },
  { route: 'log', label: 'Log', icon: 'log' },
  { route: 'character', label: 'Character', icon: 'character' },
];

/** Custom bottom tab bar matching the design doc. */
export function ForgeTabBar({ state, navigation }: any) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        bar: {
          flexDirection: 'row',
          backgroundColor: theme.tabBar,
          borderTopWidth: 1,
          borderTopColor: theme.line,
          paddingTop: 10,
        },
        tab: { flex: 1, alignItems: 'center', gap: 4 },
        label: { fontSize: 11 },
      }),
    [theme]
  );
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route: any, index: number) => {
        const tab = TABS.find((t) => t.route === route.name) ?? TABS[0];
        const focused = state.index === index;
        const color = focused ? theme.goldBright : theme.muted;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };
        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab} hitSlop={8}>
            <TabIcon name={tab.icon} size={24} color={color} strokeWidth={1.5} />
            <Text
              style={[
                styles.label,
                { color, fontFamily: focused ? theme.fonts.sans600 : theme.fonts.sans500 },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
