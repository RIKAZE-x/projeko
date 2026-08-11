import type { GameState, Item } from './types';
import type { QuestWorldPersistence } from './quest-world-persistence';
import type { QuestRuntimeState } from './quest-runtime';

export interface DialogueRequirements {
  minLevel?: number;
  requiredItemIds?: string[];
  requiredQuest?: { id: string; status?: QuestRuntimeState['status'] };
  requiredWorldFlags?: Record<string, boolean>;
  minReputation?: Record<string, number>;
}

export interface DialogueGateContext {
  game: GameState;
  inventory: Item[];
  quests: Record<string, QuestRuntimeState>;
  world: QuestWorldPersistence;
}

export interface DialogueGateResult {
  allowed: boolean;
  reasons: string[];
}

export function checkDialogueRequirements(
  requirements: DialogueRequirements | undefined,
  context: DialogueGateContext,
): DialogueGateResult {
  if (!requirements) return { allowed: true, reasons: [] };
  const reasons: string[] = [];
  if (requirements.minLevel !== undefined && context.game.character.level < requirements.minLevel) {
    reasons.push(`Requires level ${requirements.minLevel}`);
  }
  for (const itemId of requirements.requiredItemIds ?? []) {
    if (!context.inventory.some((item) => item.id === itemId)) reasons.push(`Requires item ${itemId}`);
  }
  if (requirements.requiredQuest) {
    const quest = context.quests[requirements.requiredQuest.id];
    if (!quest || (requirements.requiredQuest.status && quest.status !== requirements.requiredQuest.status)) {
      reasons.push(`Requires quest ${requirements.requiredQuest.id}`);
    }
  }
  for (const [key, expected] of Object.entries(requirements.requiredWorldFlags ?? {})) {
    if ((context.world.worldFlags[key] ?? false) !== expected) reasons.push(`Requires world flag ${key}`);
  }
  for (const [faction, minimum] of Object.entries(requirements.minReputation ?? {})) {
    if ((context.world.reputation[faction] ?? 0) < minimum) reasons.push(`Requires ${faction} reputation ${minimum}`);
  }
  return { allowed: reasons.length === 0, reasons };
}
