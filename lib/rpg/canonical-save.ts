import type { GameState, Item } from './types';
import type { SocialState } from './social-runtime';
import type { QuestWorldPersistence } from './quest-world-persistence';
import { EMPTY_QUEST_WORLD_PERSISTENCE } from './quest-world-persistence';

export interface CanonicalSaveProfile {
  version: 2;
  savedAt: string;
  slot: number;
  game: GameState;
  social: SocialState;
  session: { dungeonSeed: number; roomIndex: number; roomClears?: string[]; claimedLoot?: string[] };
  meta: { name: string; level: number; location: string; playtimeSeconds: number };
  persistence: {
    inventoryItems: Item[];
    victoryKeys: string[];
    claimedLootKeys: string[];
    questWorld: QuestWorldPersistence;
  };
}

export function createSaveProfile(
  slot: number,
  game: GameState,
  social: SocialState,
  session: CanonicalSaveProfile['session'],
  playtimeSeconds = 0,
  persistence: Partial<CanonicalSaveProfile['persistence']> = {},
): CanonicalSaveProfile {
  return {
    version: 2,
    savedAt: new Date().toISOString(),
    slot,
    game,
    social,
    session,
    meta: { name: game.character.name, level: game.character.level, location: game.location, playtimeSeconds },
    persistence: {
      inventoryItems: persistence.inventoryItems ?? [],
      victoryKeys: persistence.victoryKeys ?? [],
      claimedLootKeys: persistence.claimedLootKeys ?? [],
      questWorld: persistence.questWorld ?? EMPTY_QUEST_WORLD_PERSISTENCE,
    },
  };
}

export function validateSaveProfile(input: unknown): CanonicalSaveProfile | null {
  if (!input || typeof input !== 'object') return null;
  const x = input as Partial<CanonicalSaveProfile>;
  if (x.version !== 2 || !x.game || !x.social || !x.session) return null;
  if (typeof x.session.dungeonSeed !== 'number' || typeof x.session.roomIndex !== 'number') return null;
  const p = x.persistence ?? { inventoryItems: [], victoryKeys: [], claimedLootKeys: [], questWorld: EMPTY_QUEST_WORLD_PERSISTENCE };
  return {
    ...x,
    persistence: {
      inventoryItems: p.inventoryItems ?? [],
      victoryKeys: p.victoryKeys ?? [],
      claimedLootKeys: p.claimedLootKeys ?? [],
      questWorld: p.questWorld ?? EMPTY_QUEST_WORLD_PERSISTENCE,
    },
  } as CanonicalSaveProfile;
}
