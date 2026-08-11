export type RelationshipTier = 'hostile' | 'stranger' | 'acquaintance' | 'friendly' | 'trusted' | 'ally';

export interface NPCRelationshipState {
  npcId: string;
  affinity: number;
  interactions: number;
  giftsReceived: number;
  questsCompleted: number;
  flags: Record<string, boolean>;
}

export interface RelationshipEvent {
  affinityDelta?: number;
  gift?: boolean;
  questCompleted?: boolean;
  setFlags?: Record<string, boolean>;
}

export const RELATIONSHIP_THRESHOLDS: Array<{ min: number; tier: RelationshipTier }> = [
  { min: -50, tier: 'hostile' },
  { min: 0, tier: 'stranger' },
  { min: 20, tier: 'acquaintance' },
  { min: 45, tier: 'friendly' },
  { min: 70, tier: 'trusted' },
  { min: 90, tier: 'ally' },
];

export function relationshipTier(affinity: number): RelationshipTier {
  let tier: RelationshipTier = 'stranger';
  for (const entry of RELATIONSHIP_THRESHOLDS) {
    if (affinity >= entry.min) tier = entry.tier;
  }
  return tier;
}

export function applyRelationshipEvent(
  current: NPCRelationshipState,
  event: RelationshipEvent,
): NPCRelationshipState {
  const affinity = Math.max(-100, Math.min(100, current.affinity + (event.affinityDelta ?? 0)));
  return {
    ...current,
    affinity,
    interactions: current.interactions + 1,
    giftsReceived: current.giftsReceived + (event.gift ? 1 : 0),
    questsCompleted: current.questsCompleted + (event.questCompleted ? 1 : 0),
    flags: { ...current.flags, ...(event.setFlags ?? {}) },
  };
}
