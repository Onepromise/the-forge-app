export type Rank = 'SS' | 'S' | 'A' | 'B' | 'C' | 'D';

export const RANKS: Rank[] = ['SS', 'S', 'A', 'B', 'C', 'D'];

/** Coins (Ryō) earned for completing a quest of a given rank. Also the XP value. */
export const COINS_PER_RANK: Record<Rank, number> = {
  SS: 500,
  S: 200,
  A: 100,
  B: 50,
  C: 25,
  D: 10,
};

export type Cadence = 'once' | 'daily' | 'weekly';

export interface Realm {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Chapter {
  id: string;
  realmId: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'done';
}

export interface Quest {
  id: string;
  realmId: string;
  chapterId: string | null;
  name: string;
  rank: Rank;
  done: boolean;
  dueDate: string | null;
  /** ISO timestamp of the most recent completion. */
  completedAt?: string | null;
  /** Repeat cadence; defaults to 'once' when unset. */
  cadence?: Cadence;
}

export interface Reward {
  id: string;
  realmId: string;
  name: string;
  cost: number;
  description: string;
}

export interface Redemption {
  id: string;
  realmId: string;
  rewardId: string;
  rewardName: string;
  cost: number;
  date: string;
}

export interface QuestboardState {
  realms: Realm[];
  chapters: Chapter[];
  quests: Quest[];
  rewards: Reward[];
  redemptions: Redemption[];
}

export function coinsForRank(rank: Rank): number {
  return COINS_PER_RANK[rank];
}

/** Wallet balance for a realm: coins (Ryō) earned from completed quests minus spent on redemptions. */
export function realmBalance(state: QuestboardState, realmId: string): number {
  const earned = areaXp(state, realmId);
  const spent = state.redemptions
    .filter((r) => r.realmId === realmId)
    .reduce((sum, r) => sum + r.cost, 0);
  return earned - spent;
}

/** Lifetime XP for an area: sum of rank values of its completed quests. */
export function areaXp(state: QuestboardState, realmId: string): number {
  return state.quests
    .filter((q) => q.realmId === realmId && q.done)
    .reduce((sum, q) => sum + coinsForRank(q.rank), 0);
}

export interface LevelInfo {
  level: number;
  xpInto: number;
  xpForNext: number;
}

/** Level curve: 100 XP for level 2, then thresholds grow ~15% (rounded to 50s). */
export function levelForXp(totalXp: number): LevelInfo {
  let level = 1;
  let xpForNext = 100;
  let remaining = Math.max(0, Math.floor(totalXp));
  while (remaining >= xpForNext) {
    remaining -= xpForNext;
    level += 1;
    xpForNext = Math.max(xpForNext + 50, Math.round((xpForNext * 1.15) / 50) * 50);
  }
  return { level, xpInto: remaining, xpForNext };
}

export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Local day key `YYYY-MM-DD` for grouping timestamps. */
export function toDayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Consecutive-day streak ending today (a streak still counts if nothing
 * was handed in yet today but yesterday was active).
 */
export function streakDays(timestamps: (string | null | undefined)[]): number {
  const days = new Set<string>();
  for (const t of timestamps) {
    if (!t) continue;
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) continue;
    days.add(toDayKey(d));
  }
  if (days.size === 0) return 0;
  let streak = 0;
  const cursor = new Date();
  if (!days.has(toDayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(toDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** en-US thousands formatting for numbers. */
export function fmt(n: number): string {
  return n.toLocaleString('en-US');
}
