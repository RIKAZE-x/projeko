import type { PricedShopEntry, purchaseShopItem } from './npc-shop-runtime';

export interface ShopTransactionState {
  purchasedKeys: string[];
  stock: Record<string, number>;
  totalGoldSpent: number;
}

export interface ShopTransactionResult extends ShopTransactionState {
  ok: boolean;
  itemId?: string;
  goldSpent: number;
  reason?: string;
}

export function purchaseKey(npcId: string, itemId: string): string {
  return `${npcId}:${itemId}`;
}

export function transactShopPurchase(
  npcId: string,
  entry: PricedShopEntry,
  gold: number,
  state: ShopTransactionState,
): ShopTransactionResult {
  const key = purchaseKey(npcId, entry.itemId);
  const remaining = state.stock[key] ?? entry.stock;
  const effectiveEntry = { ...entry, stock: remaining };
  const result = purchaseShopItem(effectiveEntry, gold);
  if (!result.ok || !result.itemId) {
    return { ...state, ok: false, goldSpent: 0, reason: result.reason };
  }
  return {
    purchasedKeys: state.purchasedKeys.includes(key) ? state.purchasedKeys : [...state.purchasedKeys, key],
    stock: { ...state.stock, [key]: result.remainingStock ?? 0 },
    totalGoldSpent: state.totalGoldSpent + result.goldSpent,
    ok: true,
    itemId: result.itemId,
    goldSpent: result.goldSpent,
  };
}
