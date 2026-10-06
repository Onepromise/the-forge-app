import { QuestboardState, Realm, Chapter, Quest, Reward, Redemption, uid } from './types';

/** Sample data mirroring the Notion "Questboard" template. */
export function seedState(): QuestboardState {
  const health: Realm = { id: uid('realm'), name: 'Health', icon: '💪', color: '#30d158' };
  const learning: Realm = { id: uid('realm'), name: 'Learning', icon: '📚', color: '#0a84ff' };

  const morning: Chapter = {
    id: uid('chapter'),
    realmId: health.id,
    name: 'Morning Routine',
    status: 'in-progress',
  };

  const quests: Quest[] = [
    {
      id: uid('quest'),
      realmId: health.id,
      chapterId: morning.id,
      name: 'Run a 5K without stopping',
      rank: 'SS',
      done: false,
      dueDate: null,
    },
    {
      id: uid('quest'),
      realmId: health.id,
      chapterId: morning.id,
      name: 'Meal prep lunches for the week',
      rank: 'A',
      done: false,
      dueDate: null,
    },
    {
      id: uid('quest'),
      realmId: health.id,
      chapterId: null,
      name: 'Drink 8 glasses of water today',
      rank: 'C',
      done: false,
      dueDate: null,
    },
    {
      id: uid('quest'),
      realmId: learning.id,
      chapterId: null,
      name: 'Finish one chapter of the TypeScript book',
      rank: 'B',
      done: false,
      dueDate: null,
    },
  ];

  const rewards: Reward[] = [
    {
      id: uid('reward'),
      realmId: health.id,
      name: '1 hour of YouTube',
      cost: 60,
      description: 'Guilt-free video time. You earned it.',
    },
    {
      id: uid('reward'),
      realmId: health.id,
      name: 'Episode of a show',
      cost: 80,
      description: 'One full episode, no skipping the intro.',
    },
    {
      id: uid('reward'),
      realmId: health.id,
      name: 'Takeout night',
      cost: 200,
      description: 'Order whatever you want. Chef is off duty.',
    },
  ];

  return { realms: [health, learning], chapters: [morning], quests, rewards, redemptions: [] };
}
