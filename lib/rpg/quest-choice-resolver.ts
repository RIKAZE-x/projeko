import type { QuestDefinition, QuestRuntimeState } from './quest-runtime';

export interface QuestChoiceReaction {
  worldFlags?: Record<string, boolean>;
  npcFlags?: Record<string, boolean>;
  reputation?: Record<string, number>;
  nextQuestId?: string;
}

export function resolveQuestChoice(
  definition: QuestDefinition,
  state: QuestRuntimeState,
  choiceId: string,
): QuestChoiceReaction {
  const branch = definition.branches?.[choiceId];
  if (!branch) return {};
  return {
    worldFlags: branch.worldFlags,
    nextQuestId: branch.nextQuestId,
  };
}
