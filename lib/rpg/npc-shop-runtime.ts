import type { NPCRelationshipState } from './npc-relationship';

export interface ShopStockEntry {
  itemId: string;
  basePrice: number;
  stock: number;
  requiredTier?: string;
  requiredFlag?: string;
  priceModifier?: number;
}

export interface ShopContext {
  npcId: string;
  relationship?: NPCRelationshipState;
  worldFlags?: Record<string, boolean>;
}

export interface PricedShopEntry extends ShopStockEntry {
  unlocked: boolean;
  finalPrice: number;
  reason?: string;
}

export function priceModifierForRelationship(affinity = 0, reactionModifier = 0): number {
  const relationshipDiscount = Math.max(-0.25, Math.min(0.2, -affinity / 400));
  return relationshipDiscount + reactionModifier;
}

export function resolveShopStock(stock: ShopStockEntry[], context: ShopContext): PricedShopEntry[] {
  const affinity = context.relationship?.affinity ?? 0;
  const reactionModifier = stock.length ? stock[0].priceModifier ?? 0 : 0;
  const relationshipModifier = priceModifierForRelationship(affinity, reactionModifier);
  const tier = context.relationship?.tier;
  return stock.map((entry) => {
    if (entry.requiredTier && entry.requiredTier !== tier) {
      return { ...entry, unlocked: false, finalPrice: Math.ceil(entry.basePrice), reason: `Requires ${entry.requiredTier}` };
    }
    if (entry.requiredFlag && !context.worldFlags?.[entry.requiredFlag]) {
      return { ...entry, unlocked: false, finalPrice: Math.ceil(entry.basePrice), reason: `Requires flag ${entry.requiredFlag}` };
    }
    const finalPrice = Math.max(1, Math.ceil(entry.basePrice * (1 + relationshipModifier)));
    return { ...entry, unlocked: entry.stock > 0, finalPrice, reason: entry.stock > 0 ? undefined : 'Out of stock' };
  });
}

export interface ShopPurchaseResult {
  ok: boolean;
  goldSpent: number;
  itemId?: string;
  remainingStock?: number;
  reason?: string;
}

export function purchaseShopItem(entry: PricedShopEntry, gold: number): ShopPurchaseResult {
  if (!entry.unlocked) return { ok: false, goldSpent: 0, reason: entry.reason ?? 'Locked' };
  if (gold < entry.finalPrice) return { ok: false, goldSpent: 0, reason: 'Not enough gold' };
  return { ok: true, goldSpent: entry.finalPrice, itemId: entry.itemId, remainingStock: Math.max(0, entry.stock - 1) };
}
