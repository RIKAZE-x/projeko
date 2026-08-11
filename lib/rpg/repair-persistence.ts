export interface RepairPersistence {
  repairTransactionKeys: string[];
  totalGoldSpent: number;
  totalMaterialSpent: number;
}

export const EMPTY_REPAIR_PERSISTENCE: RepairPersistence = {
  repairTransactionKeys: [],
  totalGoldSpent: 0,
  totalMaterialSpent: 0,
};

export interface AppliedRepair {
  ok: boolean;
  transactionKey?: string;
  goldSpent?: number;
  materialSpent?: number;
}

export function applyRepairPersistence(state: RepairPersistence, result: AppliedRepair): RepairPersistence {
  if (!result.ok || !result.transactionKey) return state;
  if (state.repairTransactionKeys.includes(result.transactionKey)) return state;
  return {
    repairTransactionKeys: [...state.repairTransactionKeys, result.transactionKey],
    totalGoldSpent: state.totalGoldSpent + Math.max(0, result.goldSpent ?? 0),
    totalMaterialSpent: state.totalMaterialSpent + Math.max(0, result.materialSpent ?? 0),
  };
}

export function mergeRepairPersistence(base: RepairPersistence, incoming: RepairPersistence): RepairPersistence {
  return {
    repairTransactionKeys: [...new Set([...base.repairTransactionKeys, ...incoming.repairTransactionKeys])],
    totalGoldSpent: Math.max(base.totalGoldSpent, incoming.totalGoldSpent),
    totalMaterialSpent: Math.max(base.totalMaterialSpent, incoming.totalMaterialSpent),
  };
}
