import React from 'react';
import { Tabs } from 'expo-router';
import { ForgeTabBar } from '../../components/ForgeTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props: any) => <ForgeTabBar {...props} />}
    >
      <Tabs.Screen name="areas" options={{ title: 'Areas' }} />
      <Tabs.Screen name="quests" options={{ title: 'Quests' }} />
      <Tabs.Screen name="log" options={{ title: 'Log' }} />
      <Tabs.Screen name="character" options={{ title: 'Character' }} />
    </Tabs>
  );
}
