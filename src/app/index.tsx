import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../lib/theme';

export const ENTERED_KEY = '@questboard/entered/v1';
export const INSTALL_KEY = '@questboard/installDate/v1';

/** Root: route to the welcome screen or straight into the tabs. */
export default function RootIndex() {
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      try {
        const [entered, install] = await Promise.all([
          AsyncStorage.getItem(ENTERED_KEY),
          AsyncStorage.getItem(INSTALL_KEY),
        ]);
        if (!install) {
          await AsyncStorage.setItem(INSTALL_KEY, new Date().toISOString());
        }
        router.replace(entered ? '/(tabs)/areas' : '/enter');
      } catch {
        router.replace('/enter');
      }
    })();
  }, []);

  return <View style={{ flex: 1, backgroundColor: theme.bg }} />;
}
