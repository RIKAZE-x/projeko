import type { Item } from './types';
import { repairItem, type RepairResult } from './durability-runtime';

export interface RepairTransactionState {
  gold: number;
  materialCount: number;
  inventory: Item[];
  repairTransactionKeys: string[];
}

export interface RepairTransactionResult {
  ok: boolean;
  reason?: RepairResult['reason'];
  state: RepairTransactionState;
  result: RepairResult;
}

export function executeRepairTransaction(
  state: RepairTransactionState,
  itemId: string,
  transactionId: string,
  options: { goldPerPoint?: number; materialPerPoint?: number } = {},
): RepairTransactionResult {
  const target = state.inventory.find((item) => item.id === itemId);
  if (!target) {
    const result: RepairResult = {
      ok: false,
      reason: 'already-full',
      item: target as never,
      gold: state.gold,
      materialCount: state.materialCount,
      repairedPoints: 0,
    };
    return { ok: false, state, result };
  }

  const result = repairItem(
    {
      item: target,
      gold: state.gold,
      materialCount: state.materialCount,
      transactionId,
      goldPerPoint: options.goldPerPoint,
      materialPerPoint: options.materialPerPoint,
    },
    state.repairTransactionKeys,
  );

  if (!result.ok) return { ok: false, state, result };

  const inventory = state.inventory.map((item) => item.id === target.id ? result.item : item);
  return {
    ok: true,
    state: {
      gold: result.gold,
      materialCount: result.materialCount,
      inventory,
      repairTransactionKeys: [...state.repairTransactionKeys, result.transactionKey!],
    },
    result,
  };
}
