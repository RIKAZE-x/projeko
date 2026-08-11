import type { NPCRelationshipState } from './npc-relationship';
import type { NPCMemoryState, NPCMemoryEvent } from './npc-memory';

export interface NPCGiftDefinition {
  itemId: string;
  label: string;
  affinityDelta: number;
  tags?: string[];
}

export interface NPCGiftResult {
  relationship: NPCRelationshipState;
  memory: NPCMemoryState;
  consumedItemId: string;
}

export function applyNPCGift(
  npcId: string,
  gift: NPCGiftDefinition,
  relationship: NPCRelationshipState,
  memory: NPCMemoryState,
  remember: (state: NPCMemoryState, event: NPCMemoryEvent) => NPCMemoryState,
): NPCGiftResult {
  const now = new Date().toISOString();
  const nextRelationship = {
    ...relationship,
    affinity: Math.max(-100, Math.min(100, relationship.affinity + gift.affinityDelta)),
    giftsReceived: relationship.giftsReceived + 1,
  };
  const nextMemory = remember(memory, {
    id: `gift:${npcId}:${gift.itemId}:${now}`,
    npcId,
    kind: 'gift',
    summary: `Received ${gift.label}`,
    affinityDelta: gift.affinityDelta,
    tags: gift.tags ?? [],
    timestamp: now,
  });
  return { relationship: nextRelationship, memory: nextMemory, consumedItemId: gift.itemId };
}
