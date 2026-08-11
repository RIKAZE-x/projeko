import type { ForgeResult } from './forging-engine';

export interface ForgePersistence {
  craftedItemIds: string[];
  spentMaterialKeys: string[];
  forgeTransactionKeys: string[];
  totalGoldSpent: number;
}

export const EMPTY_FORGE_PERSISTENCE: ForgePersistence = {
  craftedItemIds: [],
  spentMaterialKeys: [],
  forgeTransactionKeys: [],
  totalGoldSpent: 0,
};

export function applyForgePersistence(
  state: ForgePersistence,
  result: ForgeResult,
  materialKeyPrefix: string,
): ForgePersistence {
  if (!result.ok || !result.transactionKey || !result.outputItemId) return state;
  if (state.forgeTransactionKeys.includes(result.transactionKey)) return state;
  const spentMaterialKeys = Object.entries(result.materials)
    .filter(([, quantity]) => quantity >= 0)
    .map(([materialId]) => `${materialKeyPrefix}:${materialId}`);
  return {
    craftedItemIds: state.craftedItemIds.includes(result.outputItemId)
      ? state.craftedItemIds
      : [...state.craftedItemIds, result.outputItemId],
    spentMaterialKeys: [...new Set([...state.spentMaterialKeys, ...spentMaterialKeys])],
    forgeTransactionKeys: [...state.forgeTransactionKeys, result.transactionKey],
    totalGoldSpent: state.totalGoldSpent + Math.max(0, result.gold),
  };
}

export function mergeForgePersistence(base: ForgePersistence, incoming: ForgePersistence): ForgePersistence {
  return {
    craftedItemIds: [...new Set([...base.craftedItemIds, ...incoming.craftedItemIds])],
    spentMaterialKeys: [...new Set([...base.spentMaterialKeys, ...incoming.spentMaterialKeys])],
    forgeTransactionKeys: [...new Set([...base.forgeTransactionKeys, ...incoming.forgeTransactionKeys])],
    totalGoldSpent: Math.max(base.totalGoldSpent, incoming.totalGoldSpent),
  };
}
