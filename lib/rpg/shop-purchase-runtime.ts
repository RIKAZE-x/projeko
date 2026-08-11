export interface ShopPurchaseInput {
  npcId: string;
  itemId: string;
  price: number;
  stock: number;
  gold: number;
  quantity?: number;
  transactionId: string;
}

export interface ShopPurchaseResult {
  ok: boolean;
  gold: number;
  stock: number;
  inventoryItemIds: string[];
  purchaseKey?: string;
  reason?: 'locked' | 'out-of-stock' | 'insufficient-gold' | 'invalid-quantity';
}

export function executeShopPurchase(input: ShopPurchaseInput): ShopPurchaseResult {
  const quantity = input.quantity ?? 1;
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, gold: input.gold, stock: input.stock, inventoryItemIds: [], reason: 'invalid-quantity' };
  }
  if (input.stock < quantity) {
    return { ok: false, gold: input.gold, stock: input.stock, inventoryItemIds: [], reason: 'out-of-stock' };
  }
  const total = input.price * quantity;
  if (input.gold < total) {
    return { ok: false, gold: input.gold, stock: input.stock, inventoryItemIds: [], reason: 'insufficient-gold' };
  }
  return {
    ok: true,
    gold: input.gold - total,
    stock: input.stock - quantity,
    inventoryItemIds: Array.from({ length: quantity }, (_, index) => `${input.itemId}#${input.transactionId}#${index + 1}`),
    purchaseKey: `${input.npcId}:${input.itemId}:${input.transactionId}`,
  };
}
