import type { CanonicalSaveProfile } from './canonical-save';
import { mergePersistence, type PersistenceState } from './persistence-bridge';

export interface CanonicalPersistenceRuntime {
  profile: CanonicalSaveProfile;
  persistence: PersistenceState;
}

export function attachPersistence(profile: CanonicalSaveProfile, persistence: PersistenceState): CanonicalSaveProfile & { persistence: PersistenceState } {
  return { ...profile, persistence: mergePersistence({ inventoryItems: [], victoryKeys: [], claimedLootKeys: [] }, persistence) };
}

export function hydratePersistence(input: CanonicalSaveProfile & { persistence?: PersistenceState }): PersistenceState {
  return mergePersistence({ inventoryItems: [], victoryKeys: [], claimedLootKeys: [] }, input.persistence ?? {});
}
