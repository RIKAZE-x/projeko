import type { NPCRelationshipState } from './npc-relationship';
import type { NPCSocialPersistence } from './npc-social-persistence';

export type NPCReactionKind = 'price_modifier' | 'quest_unlock' | 'move_npc' | 'hostile' | 'ally' | 'world_flag';

export interface NPCReactionRule {
  id: string;
  npcId: string;
  minAffinity?: number;
  minTier?: NPCRelationshipState['tier'];
  requiredFlags?: Record<string, boolean>;
  reaction: {
    kind: NPCReactionKind;
    targetId?: string;
    value?: number | boolean | string;
  };
}

const tierRank: Record<NPCRelationshipState['tier'], number> = {
  Hostile: 0,
  Stranger: 1,
  Acquaintance: 2,
  Friendly: 3,
  Trusted: 4,
  Ally: 5,
};

export function evaluateNPCReaction(
  rule: NPCReactionRule,
  relationship: NPCRelationshipState | undefined,
  state: NPCSocialPersistence,
): boolean {
  if (!relationship || relationship.npcId !== rule.npcId) return false;
  if (rule.minAffinity !== undefined && relationship.affinity < rule.minAffinity) return false;
  if (rule.minTier !== undefined && tierRank[relationship.tier] < tierRank[rule.minTier]) return false;
  for (const [flag, expected] of Object.entries(rule.requiredFlags ?? {})) {
    if ((state.eventFlags[flag] ?? false) !== expected) return false;
  }
  return true;
}

export interface NPCWorldReactionResult {
  active: string[];
}

export function resolveNPCWorldReactions(
  rules: NPCReactionRule[],
  state: NPCSocialPersistence,
): NPCWorldReactionResult {
  const active = rules
    .filter((rule) => evaluateNPCReaction(rule, state.relationships[rule.npcId], state))
    .map((rule) => rule.id);
  return { active };
}
