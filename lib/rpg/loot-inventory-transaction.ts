import type { Item } from './types';

export interface LootInventoryState {
  items: Item[];
  claimedSources: string[];
}

export interface LootClaimResult {
  state: LootInventoryState;
  claimed: boolean;
  reason: 'added'|'already-claimed'|'no-item';
}

export function emptyLootInventory(): LootInventoryState {
  return { items: [], claimedSources: [] };
}

export function claimGeneratedItem(state: LootInventoryState, sourceKey: string, item?: Item): LootClaimResult {
  if (state.claimedSources.includes(sourceKey)) return { state, claimed: false, reason: 'already-claimed' };
  if (!item) return { state: { ...state, claimedSources: [...state.claimedSources, sourceKey] }, claimed: false, reason: 'no-item' };
  return {
    state: { items: [...state.items, structuredClone(item)], claimedSources: [...state.claimedSources, sourceKey] },
    claimed: true,
    reason: 'added',
  };
}
