import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Realm } from '../lib/types';
import { useTheme } from '../lib/theme';
import { ForgeButton } from './ForgeButton';

interface Props {
  visible: boolean;
  onClose: () => void;
  realms: Realm[];
  defaultRealmId?: string;
  onSave: (realmId: string, name: string, cost: number, description: string) => void;
}

/** Add a reward to the shop. */
export function RewardSheet({ visible, onClose, realms, defaultRealmId, onSave }: Props) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [realmId, setRealmId] = useState('');

  useEffect(() => {
    if (visible) {
      setName('');
      setCost('');
      setDescription('');
      setRealmId(defaultRealmId ?? realms[0]?.id ?? '');
    }
  }, [visible, defaultRealmId, realms]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: 'rgba(10,9,8,0.7)',
          justifyContent: 'flex-end',
        },
        sheet: {
          backgroundColor: theme.card,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          borderTopWidth: 1,
          borderColor: theme.lineStrong,
        },
        grabber: {
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: '#4A443D',
          alignSelf: 'center',
          marginTop: 8,
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 14,
        },
        cancel: { fontFamily: theme.fonts.sans500, fontSize: 15, color: theme.muted },
        title: { fontFamily: theme.fonts.sans600, fontSize: 17, color: theme.text },
        save: { fontFamily: theme.fonts.sans600, fontSize: 15, color: theme.goldBright },
        body: { padding: 20, gap: 20, paddingBottom: 34 },
        field: { gap: 10 },
        label: {
          fontFamily: theme.fonts.mono500,
          fontSize: 11,
          letterSpacing: 2,
          color: theme.muted,
        },
        input: {
          minHeight: 52,
          borderWidth: 1,
          borderColor: theme.lineStrong,
          borderRadius: theme.buttonRadius,
          backgroundColor: theme.bg,
          paddingHorizontal: 14,
          fontFamily: theme.fonts.sans500,
          fontSize: 16,
          color: theme.text,
        },
        multiline: { minHeight: 76, paddingTop: 12, textAlignVertical: 'top' },
        chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
        areaChip: {
          height: 34,
          paddingHorizontal: 12,
          borderRadius: 17,
          borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
        },
        dot: { width: 8, height: 8, borderRadius: 4 },
        areaChipText: { fontFamily: theme.fonts.sans500, fontSize: 13, color: theme.text },
      }),
    [theme]
  );

  const costNum = parseInt(cost, 10);
  const save = () => {
    if (!name.trim() || !realmId || !Number.isFinite(costNum) || costNum <= 0) return;
    onSave(realmId, name.trim(), costNum, description.trim());
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>
            <Text style={styles.title}>New Reward</Text>
            <Pressable onPress={save} hitSlop={12}>
              <Text style={styles.save}>Save</Text>
            </Pressable>
          </View>
          <View style={styles.body}>
            <View style={styles.field}>
              <Text style={styles.label}>LIFE AREA</Text>
              <View style={styles.chipWrap}>
                {realms.map((r) => {
                  const active = r.id === realmId;
                  return (
                    <Pressable
                      key={r.id}
                      onPress={() => setRealmId(r.id)}
                      style={[
                        styles.areaChip,
                        {
                          borderColor: active ? r.color : theme.lineStrong,
                          backgroundColor: active ? '#3A2A1A' : 'transparent',
                        },
                      ]}
                    >
                      <View style={[styles.dot, { backgroundColor: r.color }]} />
                      <Text style={styles.areaChipText}>{r.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>REWARD</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. 1 hour of YouTube"
                placeholderTextColor={theme.muted}
                autoFocus
                returnKeyType="done"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>COST · RYŌ</Text>
              <TextInput
                style={styles.input}
                value={cost}
                onChangeText={(t) => setCost(t.replace(/[^0-9]/g, ''))}
                placeholder="60"
                placeholderTextColor={theme.muted}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>NOTE</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={description}
                onChangeText={setDescription}
                placeholder="What does this reward mean to you?"
                placeholderTextColor={theme.muted}
                multiline
              />
            </View>
            <ForgeButton
              title="Add Reward"
              onPress={save}
              disabled={!name.trim() || !realmId || !Number.isFinite(costNum) || costNum <= 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
