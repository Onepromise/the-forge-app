import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../lib/store';
import { Cadence, Quest } from '../../lib/types';
import { useTheme } from '../../lib/theme';
import { Chip } from '../../components/Chip';
import { QuestRow } from '../../components/QuestRow';
import { QuestSheet, QuestFormData } from '../../components/QuestSheet';
import { TabIcon } from '../../components/TabIcon';
import { useHandIn } from '../../components/useHandIn';

type Filter = 'today' | Cadence;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'once', label: 'One-off' },
];

/** Screen 04 — Quest Log. */
export default function QuestsScreen() {
  const theme = useTheme();
  const { state, addQuest, updateQuest, deleteQuest } = useStore();
  const insets = useSafeAreaInsets();
  const { handIn, overlay } = useHandIn();
  const [filter, setFilter] = useState<Filter>('today');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Quest | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: theme.bg },
        header: { paddingHorizontal: 20, paddingTop: 14 },
        countLine: {
          fontFamily: theme.fonts.mono500,
          fontSize: 11,
          letterSpacing: 2,
          color: theme.muted,
          marginBottom: 6,
        },
        title: {
          fontFamily: theme.fonts.cinzel600,
          fontSize: 28,
          letterSpacing: 1.5,
          color: theme.text,
        },
        chips: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingTop: 16 },
        list: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 8 },
        empty: {
          fontFamily: theme.fonts.sans400,
          fontSize: 14,
          color: theme.muted,
          textAlign: 'center',
          marginTop: 32,
        },
        fab: {
          position: 'absolute',
          right: 20,
          width: 56,
          height: 56,
          borderRadius: theme.buttonRadius,
          backgroundColor: theme.ember,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.4,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        },
      }),
    [theme]
  );

  const realmById = useMemo(() => new Map(state.realms.map((r) => [r.id, r])), [state.realms]);

  const visible = useMemo(() => {
    let list = state.quests;
    if (filter !== 'today') {
      list = list.filter((q) => (q.cadence ?? 'once') === filter);
    }
    return [...list].sort((a, b) => Number(a.done) - Number(b.done));
  }, [state.quests, filter]);

  const openCount = state.quests.filter((q) => !q.done).length;
  const doneCount = state.quests.filter((q) => q.done).length;

  const openAdd = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (quest: Quest) => {
    setEditing(quest);
    setSheetOpen(true);
  };

  const save = (data: QuestFormData) => {
    if (editing) {
      updateQuest(editing.id, {
        name: data.name,
        rank: data.rank,
        realmId: data.realmId,
        cadence: data.cadence,
        dueDate: data.dueDate,
      });
    } else {
      addQuest(data.realmId, data.name, data.rank, null, {
        cadence: data.cadence,
        dueDate: data.dueDate,
      });
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.countLine}>
            {openCount} OPEN · {doneCount} HANDED IN
          </Text>
          <Text style={styles.title}>Quest Log</Text>
        </View>
      </View>

      <View style={styles.chips}>
        {FILTERS.map((f) => (
          <Chip key={f.key} label={f.label} active={filter === f.key} onPress={() => setFilter(f.key)} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {visible.map((q) => {
          const realm = realmById.get(q.realmId);
          return (
            <QuestRow
              key={q.id}
              quest={q}
              areaName={realm?.name ?? 'Area'}
              areaColor={realm?.color ?? theme.gold}
              onHandIn={() => handIn(q)}
              onLongPress={() => openEdit(q)}
            />
          );
        })}
        {visible.length === 0 ? (
          <Text style={styles.empty}>No quests here. Post one with the forge button.</Text>
        ) : null}
      </ScrollView>

      <Pressable
        onPress={openAdd}
        style={[styles.fab, { bottom: insets.bottom + 104 }]}
        accessibilityLabel="Add quest"
      >
        <TabIcon name="add" size={24} color={theme.text} strokeWidth={2} />
      </Pressable>

      <QuestSheet
        visible={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setEditing(null);
        }}
        realms={state.realms}
        initial={editing}
        onSave={save}
        onDelete={editing ? () => deleteQuest(editing.id) : undefined}
      />

      {overlay}
    </View>
  );
}
