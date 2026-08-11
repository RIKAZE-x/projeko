import type { NPCRelationshipState } from './npc-relationship';
import type { NPCMemory } from './npc-memory';

export interface NPCSocialPersistence {
  relationships: Record<string, NPCRelationshipState>;
  memories: Record<string, NPCMemory[]>;
  eventFlags: Record<string, boolean>;
}

export const EMPTY_NPC_SOCIAL_PERSISTENCE: NPCSocialPersistence = {
  relationships: {},
  memories: {},
  eventFlags: {},
};

export function mergeNPCSocialPersistence(
  base: NPCSocialPersistence = EMPTY_NPC_SOCIAL_PERSISTENCE,
  incoming: Partial<NPCSocialPersistence> = {},
): NPCSocialPersistence {
  const relationships = { ...base.relationships, ...(incoming.relationships ?? {}) };
  const memories = { ...base.memories };

  for (const [npcId, items] of Object.entries(incoming.memories ?? {})) {
    const seen = new Set((memories[npcId] ?? []).map((item) => item.id));
    memories[npcId] = [
      ...(memories[npcId] ?? []),
      ...items.filter((item) => !seen.has(item.id)),
    ];
  }

  return {
    relationships,
    memories,
    eventFlags: { ...base.eventFlags, ...(incoming.eventFlags ?? {}) },
  };
}
