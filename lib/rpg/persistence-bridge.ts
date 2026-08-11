import type { Item } from './types';
import type { CanonicalSaveProfile } from './canonical-save';

export interface PersistenceSnapshot {
 inventoryItems: Item[];
 victoryKeys: string[];
 claimedLootKeys: string[];
}

export function toPersistenceSnapshot(profile: CanonicalSaveProfile): PersistenceSnapshot {
 return {
  inventoryItems: structuredClone(profile.persistence.inventoryItems),
  victoryKeys: [...profile.persistence.victoryKeys],
  claimedLootKeys: [...profile.persistence.claimedLootKeys],
 };
}

export function mergePersistence(base: PersistenceSnapshot, patch: Partial<PersistenceSnapshot>): PersistenceSnapshot {
 const items = [...base.inventoryItems, ...(patch.inventoryItems ?? [])];
 const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());
 return {
  inventoryItems: uniqueItems,
  victoryKeys: Array.from(new Set([...(base.victoryKeys ?? []), ...(patch.victoryKeys ?? [])])),
  claimedLootKeys: Array.from(new Set([...(base.claimedLootKeys ?? []), ...(patch.claimedLootKeys ?? [])])),
 };
}
