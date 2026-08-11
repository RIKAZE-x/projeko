import type { CanonicalSaveProfile } from './canonical-save';
import type { GameRuntimeState } from './game-runtime-state';
import { syncRuntimeToGame } from './game-runtime-controller';

export interface RuntimePersistenceSnapshot {
  inventoryItems: GameRuntimeState['inventory'];
  claimedLootKeys: GameRuntimeState['claimedLootKeys'];
  equipment: GameRuntimeState['equipment'];
  quests: GameRuntimeState['quests'];
  shopEconomy: GameRuntimeState['shopEconomy'];
  forge: GameRuntimeState['forge'];
  repair: GameRuntimeState['repair'];
}

export function runtimeToPersistence(state: GameRuntimeState): RuntimePersistenceSnapshot {
  const normalized = syncRuntimeToGame(state);
  return {
    inventoryItems: normalized.inventory,
    claimedLootKeys: normalized.claimedLootKeys,
    equipment: normalized.equipment,
    quests: normalized.quests,
    shopEconomy: normalized.shopEconomy,
    forge: normalized.forge,
    repair: normalized.repair,
  };
}

export function persistenceToRuntimePersistence(profile: CanonicalSaveProfile): Partial<RuntimePersistenceSnapshot> {
  return {
    inventoryItems: profile.persistence.inventoryItems,
    claimedLootKeys: profile.persistence.claimedLootKeys,
    equipment: profile.persistence.equipment,
    quests: profile.persistence.questWorld,
    shopEconomy: profile.persistence.shopEconomy,
  };
}
