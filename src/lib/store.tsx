import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Cadence,
  Chapter,
  Quest,
  QuestboardState,
  Rank,
  Realm,
  Redemption,
  Reward,
  coinsForRank,
  realmBalance,
  uid,
} from './types';
import { seedState } from './seed';

const STORAGE_KEY = '@questboard/state/v1';

export interface QuestPatch {
  name?: string;
  rank?: Rank;
  realmId?: string;
  chapterId?: string | null;
  cadence?: Cadence;
  dueDate?: string | null;
}

interface Store {
  state: QuestboardState;
  loaded: boolean;
  addRealm: (name: string, icon: string, color: string) => void;
  renameRealm: (realmId: string, name: string) => void;
  addChapter: (realmId: string, name: string) => void;
  addQuest: (
    realmId: string,
    name: string,
    rank: Rank,
    chapterId: string | null,
    opts?: { cadence?: Cadence; dueDate?: string | null }
  ) => void;
  updateQuest: (questId: string, patch: QuestPatch) => void;
  deleteQuest: (questId: string) => void;
  toggleQuest: (questId: string) => { coins: number; completed: boolean } | null;
  addReward: (realmId: string, name: string, cost: number, description: string) => void;
  redeemReward: (realmId: string, rewardId: string) => boolean;
  balance: (realmId: string) => number;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QuestboardState | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state (or seed on first run).
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          setState(JSON.parse(raw) as QuestboardState);
        } else {
          setState(seedState());
        }
      } catch {
        setState(seedState());
      }
    })();
  }, []);

  // Persist on change (debounced).
  useEffect(() => {
    if (!state) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state]);

  const addRealm = useCallback((name: string, icon: string, color: string) => {
    const realm: Realm = { id: uid('realm'), name: name.trim(), icon, color };
    setState((s) => (s ? { ...s, realms: [...s.realms, realm] } : s));
  }, []);

  const renameRealm = useCallback((realmId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((s) =>
      s
        ? { ...s, realms: s.realms.map((r) => (r.id === realmId ? { ...r, name: trimmed } : r)) }
        : s
    );
  }, []);

  const addChapter = useCallback((realmId: string, name: string) => {
    const chapter: Chapter = {
      id: uid('chapter'),
      realmId,
      name: name.trim(),
      status: 'not-started',
    };
    setState((s) => (s ? { ...s, chapters: [...s.chapters, chapter] } : s));
  }, []);

  const addQuest = useCallback(
    (
      realmId: string,
      name: string,
      rank: Rank,
      chapterId: string | null,
      opts?: { cadence?: Cadence; dueDate?: string | null }
    ) => {
      const quest: Quest = {
        id: uid('quest'),
        realmId,
        chapterId,
        name: name.trim(),
        rank,
        done: false,
        dueDate: opts?.dueDate ?? null,
        completedAt: null,
        cadence: opts?.cadence ?? 'once',
      };
      setState((s) => (s ? { ...s, quests: [...s.quests, quest] } : s));
    },
    []
  );

  const updateQuest = useCallback((questId: string, patch: QuestPatch) => {
    setState((s) => {
      if (!s) return s;
      return {
        ...s,
        quests: s.quests.map((q) => {
          if (q.id !== questId) return q;
          const next = { ...q };
          if (patch.name !== undefined) next.name = patch.name.trim() || q.name;
          if (patch.rank !== undefined) next.rank = patch.rank;
          if (patch.realmId !== undefined) next.realmId = patch.realmId;
          if (patch.chapterId !== undefined) next.chapterId = patch.chapterId;
          if (patch.cadence !== undefined) next.cadence = patch.cadence;
          if (patch.dueDate !== undefined) next.dueDate = patch.dueDate;
          return next;
        }),
      };
    });
  }, []);

  const deleteQuest = useCallback((questId: string) => {
    setState((s) => (s ? { ...s, quests: s.quests.filter((q) => q.id !== questId) } : s));
  }, []);

  /** Toggle a quest's done state. Returns coins awarded (or 0 when un-completing). */
  const toggleQuest = useCallback(
    (questId: string): { coins: number; completed: boolean } | null => {
      let result: { coins: number; completed: boolean } | null = null;
      setState((s) => {
        if (!s) return s;
        const quests = s.quests.map((q) => {
          if (q.id !== questId) return q;
          const done = !q.done;
          result = { coins: done ? coinsForRank(q.rank) : 0, completed: done };
          return { ...q, done, completedAt: done ? new Date().toISOString() : q.completedAt };
        });
        return { ...s, quests };
      });
      return result;
    },
    []
  );

  const addReward = useCallback(
    (realmId: string, name: string, cost: number, description: string) => {
      const reward: Reward = {
        id: uid('reward'),
        name: name.trim(),
        realmId,
        cost,
        description: description.trim(),
      };
      setState((s) => (s ? { ...s, rewards: [...s.rewards, reward] } : s));
    },
    []
  );

  /** Redeem a reward if the realm wallet can afford it. Returns success. */
  const redeemReward = useCallback((realmId: string, rewardId: string): boolean => {
    let ok = false;
    setState((s) => {
      if (!s) return s;
      const reward = s.rewards.find((r) => r.id === rewardId);
      if (!reward) return s;
      if (realmBalance(s, realmId) < reward.cost) return s;
      ok = true;
      const redemption: Redemption = {
        id: uid('redemption'),
        realmId,
        rewardId,
        rewardName: reward.name,
        cost: reward.cost,
        date: new Date().toISOString(),
      };
      return { ...s, redemptions: [...s.redemptions, redemption] };
    });
    return ok;
  }, []);

  const balance = useCallback(
    (realmId: string) => (state ? realmBalance(state, realmId) : 0),
    [state]
  );

  const value = useMemo<Store | null>(() => {
    if (!state) return null;
    return {
      state,
      loaded: true,
      addRealm,
      renameRealm,
      addChapter,
      addQuest,
      updateQuest,
      deleteQuest,
      toggleQuest,
      addReward,
      redeemReward,
      balance,
    };
  }, [
    state,
    addRealm,
    renameRealm,
    addChapter,
    addQuest,
    updateQuest,
    deleteQuest,
    toggleQuest,
    addReward,
    redeemReward,
    balance,
  ]);

  if (!value) return null;
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
