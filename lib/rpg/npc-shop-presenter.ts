import type { NPCShopEntry } from '@/components/rpg/NPCShopPanel';

export interface ShopItemDefinition {
  id: string;
  name: string;
  basePrice: number;
  stock: number;
  unlocked: boolean;
  lockReason?: string;
}

export function presentNPCShop(items: ShopItemDefinition[], priceMultiplier = 1): NPCShopEntry[] {
  const safeMultiplier = Number.isFinite(priceMultiplier) && priceMultiplier > 0 ? priceMultiplier : 1;
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    basePrice: item.basePrice,
    finalPrice: Math.max(1, Math.round(item.basePrice * safeMultiplier)),
    stock: Math.max(0, item.stock),
    unlocked: item.unlocked,
    reason: item.lockReason,
  }));
}
