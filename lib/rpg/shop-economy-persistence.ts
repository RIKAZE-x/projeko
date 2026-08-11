export interface ShopEconomyState {
  gold: number;
  stock: Record<string, number>;
  restockCycle: Record<string, number>;
  purchasedKeys: string[];
  totalGoldSpent: number;
}

export const EMPTY_SHOP_ECONOMY: ShopEconomyState = {
  gold: 0,
  stock: {},
  restockCycle: {},
  purchasedKeys: [],
  totalGoldSpent: 0,
};

export function mergeShopEconomy(base: ShopEconomyState, next: Partial<ShopEconomyState>): ShopEconomyState {
  return {
    gold: typeof next.gold === 'number' ? next.gold : base.gold,
    stock: { ...base.stock, ...(next.stock ?? {}) },
    restockCycle: { ...base.restockCycle, ...(next.restockCycle ?? {}) },
    purchasedKeys: Array.from(new Set([...base.purchasedKeys, ...(next.purchasedKeys ?? [])])),
    totalGoldSpent: typeof next.totalGoldSpent === 'number' ? next.totalGoldSpent : base.totalGoldSpent,
  };
}
