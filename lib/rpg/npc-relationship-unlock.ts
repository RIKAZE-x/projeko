import type { RelationshipTier, NPCRelationshipState } from './npc-relationship';

export interface RelationshipUnlock {
  id: string;
  minTier?: RelationshipTier;
  minAffinity?: number;
  questId?: string;
  dialogueNodeId?: string;
  worldFlag?: string;
}

const tierOrder: RelationshipTier[] = ['hostile', 'stranger', 'acquaintance', 'friendly', 'trusted', 'ally'];

export function canUnlockRelationshipContent(
  state: NPCRelationshipState,
  tier: RelationshipTier,
  unlock: RelationshipUnlock,
  hasQuest: (questId: string) => boolean = () => false,
): boolean {
  if (unlock.minAffinity !== undefined && state.affinity < unlock.minAffinity) return false;
  if (unlock.minTier !== undefined && tierOrder.indexOf(tier) < tierOrder.indexOf(unlock.minTier)) return false;
  if (unlock.questId && !hasQuest(unlock.questId)) return false;
  if (unlock.worldFlag && !state.flags[unlock.worldFlag]) return false;
  return true;
}
