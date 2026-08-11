export interface ShopStockState {
  stock: Record<string, number>;
  cycle: number;
}

export interface ShopRestockRule {
  itemId: string;
  amount: number;
  everyCycles: number;
  maxStock: number;
}

export function restockShop(state: ShopStockState, rules: ShopRestockRule[], cycle: number): ShopStockState {
  const next = { ...state.stock };
  for (const rule of rules) {
    if (rule.everyCycles <= 0 || cycle % rule.everyCycles !== 0) continue;
    next[rule.itemId] = Math.min(rule.maxStock, (next[rule.itemId] ?? 0) + Math.max(0, rule.amount));
  }
  return { stock: next, cycle };
}
