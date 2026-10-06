import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Cadence,
  Quest,
  RANKS,
  Rank,
  Realm,
  coinsForRank,
  fmt,
  toDayKey,
} from '../lib/types';
import { useTheme } from '../lib/theme';
import { HexBadge } from './HexBadge';
import { ForgeButton } from './ForgeButton';

export interface QuestFormData {
  name: string;
  realmId: string;
  rank: Rank;
  cadence: Cadence;
  dueDate: string | null;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  realms: Realm[];
  /** When set, the sheet edits this quest. */
  initial?: Quest | null;
  defaultRealmId?: string;
  onSave: (data: QuestFormData) => void;
  onDelete?: () => void;
}

const REPEATS: { key: Cadence; label: string }[] = [
  { key: 'once', label: 'Once' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
];

function dayKey(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return toDayKey(d);
}

function dueLabel(dueDate: string | null): string {
  if (!dueDate) return 'None';
  if (dueDate === dayKey(0)) return 'Today';
  if (dueDate === dayKey(1)) return 'Tomorrow';
  return dueDate;
}

/** Add / Edit quest bottom sheet (screen 04b). */
export function QuestSheet({ visible, onClose, realms, initial, defaultRealmId, onSave, onDelete }: Props) {
  const theme = useTheme();
  const editing = !!initial;
  const [name, setName] = useState('');
  const [realmId, setRealmId] = useState('');
  const [rank, setRank] = useState<Rank>('B');
  const [cadence, setCadence] = useState<Cadence>('once');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(initial?.name ?? '');
      setRealmId(initial?.realmId ?? defaultRealmId ?? realms[0]?.id ?? '');
      setRank(initial?.rank ?? 'B');
      setCadence(initial?.cadence ?? 'once');
      setDueDate(initial?.dueDate ?? null);
    }
  }, [visible, initial, defaultRealmId, realms]);

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
          maxHeight: '92%',
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
        body: { padding: 20, gap: 22, paddingBottom: 34 },
        field: { gap: 10 },
        label: {
          fontFamily: theme.fonts.mono500,
          fontSize: 11,
          letterSpacing: 2,
          color: theme.muted,
        },
        labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        rankValue: { fontFamily: theme.fonts.mono500, fontSize: 11, color: theme.goldBright },
        input: {
          minHeight: 52,
          borderWidth: 1,
          borderColor: theme.lineStrong,
          borderRadius: theme.buttonRadius,
          backgroundColor: theme.bg,
          paddingHorizontal: 14,
          fontFamily: theme.fonts.sans500,
          fontSize: 17,
          color: theme.text,
        },
        inputFocused: { borderColor: theme.gold },
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
        rankGrid: { flexDirection: 'row', gap: 6 },
        rankCell: {
          flex: 1,
          alignItems: 'center',
          gap: 6,
          paddingVertical: 10,
          borderRadius: theme.buttonRadius,
          borderWidth: 1,
        },
        rankXp: { fontFamily: theme.fonts.mono500, fontSize: 10, color: theme.muted },
        segment: {
          flexDirection: 'row',
          backgroundColor: theme.bg,
          borderWidth: 1,
          borderColor: theme.line,
          borderRadius: theme.buttonRadius,
          padding: 3,
        },
        segmentBtn: {
          flex: 1,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 3,
        },
        segmentActive: { backgroundColor: '#34302B' },
        segmentText: { fontFamily: theme.fonts.sans500, fontSize: 13, color: theme.muted },
        segmentTextActive: { fontFamily: theme.fonts.sans600, color: theme.text },
        dueRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 14,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: theme.line,
        },
        dueLabel: { fontFamily: theme.fonts.sans500, fontSize: 15, color: theme.text },
        dueValue: { fontFamily: theme.fonts.sans500, fontSize: 15, color: theme.text2 },
        footer: { gap: 12, marginTop: 4 },
        archive: { alignItems: 'center', paddingVertical: 8 },
        archiveText: { fontFamily: theme.fonts.sans500, fontSize: 14, color: '#C1502E' },
        hint: {
          fontFamily: theme.fonts.sans400,
          fontSize: 12,
          lineHeight: 18,
          color: theme.muted,
          textAlign: 'center',
        },
      }),
    [theme]
  );

  const cycleDue = () => {
    setDueDate((d) => {
      if (!d) return dayKey(0);
      if (d === dayKey(0)) return dayKey(1);
      return null;
    });
  };

  const save = () => {
    if (!name.trim() || !realmId) return;
    onSave({ name: name.trim(), realmId, rank, cadence, dueDate });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>
            <Text style={styles.title}>{editing ? 'Edit Quest' : 'New Quest'}</Text>
            <Pressable onPress={save} hitSlop={12}>
              <Text style={styles.save}>Save</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.field}>
              <Text style={styles.label}>QUEST</Text>
              <TextInput
                style={[styles.input, focused && styles.inputFocused]}
                value={name}
                onChangeText={setName}
                placeholder="Name the quest"
                placeholderTextColor={theme.muted}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoFocus={!editing}
                returnKeyType="done"
              />
            </View>

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
              <View style={styles.labelRow}>
                <Text style={styles.label}>RANK</Text>
                <Text style={styles.rankValue}>
                  {rank} · {fmt(coinsForRank(rank))} XP
                </Text>
              </View>
              <View style={styles.rankGrid}>
                {RANKS.map((r) => {
                  const active = r === rank;
                  return (
                    <Pressable
                      key={r}
                      onPress={() => setRank(r)}
                      style={[
                        styles.rankCell,
                        {
                          borderColor: active ? '#D4A24C' : theme.line,
                          backgroundColor: active ? '#2A2112' : theme.bg,
                        },
                      ]}
                    >
                      <HexBadge rank={r} size={30} />
                      <Text style={styles.rankXp}>{fmt(coinsForRank(r))}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>REPEAT</Text>
              <View style={styles.segment}>
                {REPEATS.map((rep) => {
                  const active = rep.key === cadence;
                  return (
                    <Pressable
                      key={rep.key}
                      onPress={() => setCadence(rep.key)}
                      style={[styles.segmentBtn, active && styles.segmentActive]}
                    >
                      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                        {rep.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pressable style={styles.dueRow} onPress={cycleDue}>
              <Text style={styles.dueLabel}>Due</Text>
              <Text style={styles.dueValue}>{dueLabel(dueDate)} ›</Text>
            </Pressable>

            <View style={styles.footer}>
              <ForgeButton
                title={editing ? 'Save Changes' : 'Post Quest'}
                onPress={save}
                disabled={!name.trim() || !realmId}
              />
              {editing && onDelete ? (
                <Pressable onPress={() => { onDelete(); onClose(); }} style={styles.archive}>
                  <Text style={styles.archiveText}>Archive quest</Text>
                </Pressable>
              ) : null}
              {!editing ? (
                <Text style={styles.hint}>
                  Edit mode reuses this sheet with an Archive action.
                </Text>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
