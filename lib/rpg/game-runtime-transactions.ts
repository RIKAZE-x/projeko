import type { Item } from './types';
import type { GameRuntimeState } from './game-runtime-state';
import { patchGameRuntimeState, syncCharacterInventory } from './game-runtime-state';
import { executeShopPurchase } from './shop-purchase-runtime';
import { executeForgeTransaction } from './forge-transaction';
import type { ForgeInput } from './forging-engine';
import { claimGeneratedItem } from './loot-inventory-transaction';

export interface RuntimeShopPurchaseInput {
  npcId: string;
  itemId: string;
  price: number;
  stock: number;
  transactionId: string;
  quantity?: number;
  itemFactory?: (itemId: string, instanceId: string) => Item;
}

export function applyShopPurchase(state: GameRuntimeState, input: RuntimeShopPurchaseInput): GameRuntimeState {
  const result = executeShopPurchase({ ...input, gold: state.game.character.gold });
  if (!result.ok || !result.purchaseKey) return state;

  const createdItems = result.inventoryItemIds.map((instanceId) =>
    input.itemFactory
      ? input.itemFactory(input.itemId, instanceId)
      : {
          id: instanceId,
          name: input.itemId,
          category: 'Material' as const,
          baseType: input.itemId,
          material: { id: 'shop', name: 'Purchased', hardness: null, durability: null, manaConductivity: 0, weight: 0 },
          level: state.game.character.level,
          quality: 50,
          rank: 'F' as const,
          rarity: 'Common' as const,
          affixes: [],
          traits: [],
          soulResonance: 0,
          history: { kills: 0, ownerYears: 0, notableEvents: [`purchase:${result.purchaseKey}`] },
          condition: 100,
        },
  );

  const nextShopEconomy = {
    ...state.shopEconomy,
    purchasedKeys: [...new Set([...state.shopEconomy.purchasedKeys, result.purchaseKey])],
    stock: { ...state.shopEconomy.stock, [`${input.npcId}:${input.itemId}`]: result.stock },
    totalGoldSpent: state.shopEconomy.totalGoldSpent + input.price * (input.quantity ?? 1),
  };

  return syncCharacterInventory(patchGameRuntimeState(state, {
    inventory: [...state.inventory, ...createdItems],
    shopEconomy: nextShopEconomy,
    game: { ...state.game, character: { ...state.game.character, gold: result.gold } },
  }));
}

export function applyForge(
  state: GameRuntimeState,
  input: ForgeInput & { targetItemId?: string },
  materialCounts: Record<string, number>,
): GameRuntimeState {
  const result = executeForgeTransaction({
    gold: state.game.character.gold,
    materials: materialCounts,
    inventory: state.inventory,
    forgeTransactionKeys: state.forge.forgeTransactionKeys,
  }, input);
  if (!result.ok || !result.result) return state;

  return syncCharacterInventory(patchGameRuntimeState(state, {
    inventory: result.state.inventory,
    forge: {
      ...state.forge,
      craftedItemIds: [...new Set([...state.forge.craftedItemIds, ...(result.item ? [result.item.id] : [])])],
      forgeTransactionKeys: result.state.forgeTransactionKeys,
      totalGoldSpent: state.forge.totalGoldSpent + result.result.goldSpent,
    },
    game: { ...state.game, character: { ...state.game.character, gold: result.state.gold } },
  }));
}

export function applyLootClaim(state: GameRuntimeState, sourceKey: string, item: Item | undefined): GameRuntimeState {
  if (state.claimedLootKeys.includes(sourceKey)) return state;
  const claimed = claimGeneratedItem({ items: state.inventory, claimedSources: state.claimedLootKeys }, sourceKey, item);
  if (!claimed.claimed) return state;
  return syncCharacterInventory(patchGameRuntimeState(state, {
    inventory: claimed.state.items,
    claimedLootKeys: claimed.state.claimedSources,
  }));
}
