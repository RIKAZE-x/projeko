import type { Item } from './types';

export type DurabilityReason = 'combat-hit' | 'combat-use' | 'environment' | 'repair';

export interface DurabilityEvent {
  itemId: string;
  amount: number;
  reason: DurabilityReason;
}

export function applyDurabilityDamage(item: Item, amount: number, reason: DurabilityReason): Item {
  const damage = Math.max(0, Math.floor(amount));
  if (damage === 0) return item;
  const condition = Math.max(0, item.condition - damage);
  return {
    ...item,
    condition,
    history: {
      ...item.history,
      notableEvents: [...item.history.notableEvents, `durability:${reason}:${damage}`],
    },
  };
}

export interface RepairInput {
  item: Item;
  gold: number;
  materialCount: number;
  transactionId: string;
  goldPerPoint?: number;
  materialPerPoint?: number;
}

export interface RepairResult {
  ok: boolean;
  reason?: 'item-not-found' | 'already-full' | 'insufficient-gold' | 'insufficient-materials' | 'duplicate-transaction';
  item: Item;
  gold: number;
  materialCount: number;
  repairedPoints: number;
  transactionKey?: string;
}

export function repairItem(input: RepairInput, appliedTransactions: string[] = []): RepairResult {
  const target = Math.max(0, Math.min(100, Math.floor(input.item.condition)));
  const repairedPoints = 100 - target;
  const goldPerPoint = Math.max(0, input.goldPerPoint ?? 2);
  const materialPerPoint = Math.max(0, input.materialPerPoint ?? 1);
  const transactionKey = `repair:${input.item.id}:${input.transactionId}`;

  if (appliedTransactions.includes(transactionKey)) {
    return { ok: false, reason: 'duplicate-transaction', item: input.item, gold: input.gold, materialCount: input.materialCount, repairedPoints: 0, transactionKey };
  }
  if (repairedPoints === 0) {
    return { ok: false, reason: 'already-full', item: input.item, gold: input.gold, materialCount: input.materialCount, repairedPoints: 0 };
  }
  const goldCost = repairedPoints * goldPerPoint;
  const materialCost = repairedPoints * materialPerPoint;
  if (input.gold < goldCost) {
    return { ok: false, reason: 'insufficient-gold', item: input.item, gold: input.gold, materialCount: input.materialCount, repairedPoints: 0 };
  }
  if (input.materialCount < materialCost) {
    return { ok: false, reason: 'insufficient-materials', item: input.item, gold: input.gold, materialCount: input.materialCount, repairedPoints: 0 };
  }

  return {
    ok: true,
    item: {
      ...input.item,
      condition: 100,
      history: {
        ...input.item.history,
        notableEvents: [...input.item.history.notableEvents, `repair:${input.transactionId}:${repairedPoints}`],
      },
    },
    gold: input.gold - goldCost,
    materialCount: input.materialCount - materialCost,
    repairedPoints,
    transactionKey,
  };
}
