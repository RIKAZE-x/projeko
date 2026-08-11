import type { Item } from './types';
import { executeForge, type ForgeInput, type ForgeResult } from './forging-engine';
import { applyForgeToItem } from './forging-item-adapter';

export interface ForgeTransactionState {
  gold: number;
  materials: Record<string, number>;
  inventory: Item[];
  forgeTransactionKeys: string[];
}

export interface ForgeTransactionResult {
  ok: boolean;
  reason?: ForgeResult['reason'] | 'duplicate-transaction' | 'item-not-found' | 'invalid-operation';
  state: ForgeTransactionState;
  result?: ForgeResult;
  item?: Item;
}

export function executeForgeTransaction(
  state: ForgeTransactionState,
  input: ForgeInput & { targetItemId?: string },
): ForgeTransactionResult {
  if (state.forgeTransactionKeys.includes(`forge:${input.recipe.id}:${input.transactionId}`)) {
    return { ok: false, reason: 'duplicate-transaction', state };
  }

  if (input.recipe.operation === 'upgrade' || input.recipe.operation === 'reroll-affix') {
    if (!input.targetItemId) return { ok: false, reason: 'item-not-found', state };
    if (!state.inventory.some((item) => item.id === input.targetItemId)) {
      return { ok: false, reason: 'item-not-found', state };
    }
  }

  const preview = executeForge(input);
  if (!preview.ok) return { ok: false, reason: preview.reason, state, result: preview };

  let inventory = state.inventory;
  let item: Item | undefined;

  if (input.targetItemId) {
    const target = inventory.find((entry) => entry.id === input.targetItemId);
    if (!target) return { ok: false, reason: 'item-not-found', state, result: preview };
    item = applyForgeToItem(target, preview);
    inventory = inventory.map((entry) => entry.id === target.id ? item! : entry);
  } else if (preview.outputItemId) {
    const generated: Item = {
      id: `${preview.outputItemId}:${input.transactionId}`,
      name: preview.outputItemId,
      category: 'Material',
      level: input.playerRank,
      quality: 0,
      rank: 'F',
      rarity: 'Common',
      affixes: [],
      traits: [],
      soulResonance: 0,
      history: { kills: 0, ownerYears: 0, notableEvents: [`Forged:${input.transactionId}`] },
      condition: 100,
    };
    item = applyForgeToItem(generated, preview);
    inventory = [...inventory, item];
  }

  const nextState: ForgeTransactionState = {
    gold: preview.gold,
    materials: preview.materials,
    inventory,
    forgeTransactionKeys: [...state.forgeTransactionKeys, preview.transactionKey!],
  };

  return { ok: true, state: nextState, result: preview, item };
}
