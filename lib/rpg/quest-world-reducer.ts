import type { QuestChoiceReaction } from './quest-choice-resolver';

export interface QuestWorldState {
  worldFlags: Record<string, boolean>;
  npcFlags: Record<string, boolean>;
  reputation: Record<string, number>;
  activeQuests: Record<string, unknown>;
}

export function applyQuestReaction(state: QuestWorldState, reaction: QuestChoiceReaction): QuestWorldState {
  const reputation = { ...state.reputation };
  for (const [faction, delta] of Object.entries(reaction.reputation ?? {})) {
    reputation[faction] = (reputation[faction] ?? 0) + delta;
  }
  return {
    ...state,
    worldFlags: { ...state.worldFlags, ...reaction.worldFlags },
    npcFlags: { ...state.npcFlags, ...reaction.npcFlags },
    reputation,
  };
}
