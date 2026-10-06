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
  /** When set, the sheet renames this area. */
  initial?: Realm | null;
  onSave: (name: string, color: string) => void;
}

/** Add / rename life-area sheet. */
export function RealmSheet({ visible, onClose, initial, onSave }: Props) {
  const theme = useTheme();
  const editing = !!initial;
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(theme.areaPalette[0]);

  useEffect(() => {
    if (visible) {
      setName(initial?.name ?? '');
      const palette = theme.areaPalette;
      setColor(initial?.color ?? palette[Math.floor(Math.random() * palette.length)]);
    }
  }, [visible, initial, theme]);

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
          fontSize: 17,
          color: theme.text,
        },
        palette: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
        swatch: {
          width: 44,
          height: 44,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: 'transparent',
        },
        swatchActive: { borderColor: theme.goldBright },
      }),
    [theme]
  );

  const save = () => {
    if (!name.trim()) return;
    onSave(name.trim(), color);
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
            <Text style={styles.title}>{editing ? 'Rename Area' : 'New Life Area'}</Text>
            <Pressable onPress={save} hitSlop={12}>
              <Text style={styles.save}>Save</Text>
            </Pressable>
          </View>
          <View style={styles.body}>
            <View style={styles.field}>
              <Text style={styles.label}>NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Game Dev"
                placeholderTextColor={theme.muted}
                autoFocus={!editing}
                returnKeyType="done"
              />
            </View>
            {!editing ? (
              <View style={styles.field}>
                <Text style={styles.label}>COLOR</Text>
                <View style={styles.palette}>
                  {theme.areaPalette.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setColor(c)}
                      style={[
                        styles.swatch,
                        { backgroundColor: c },
                        color === c && styles.swatchActive,
                      ]}
                    />
                  ))}
                </View>
              </View>
            ) : null}
            <ForgeButton
              title={editing ? 'Save Changes' : 'Create Area'}
              onPress={save}
              disabled={!name.trim()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
