import type { GameState, Item } from './types';
import type { DungeonRoomRuntime } from './dungeon-room-runtime';
import type { QuestWorldPersistence } from './quest-world-persistence';
import type { ShopEconomyState } from './shop-economy-persistence';
import type { EquipmentPersistence } from './equipment-persistence';
import type { ForgePersistence } from './forge-persistence';
import type { RepairTransactionState } from './repair-transaction';
import type { WorldInteractionState } from './world-interaction-controller';

export interface GameRuntimeState {
  game: GameState;
  dungeon: DungeonRoomRuntime;
  inventory: Item[];
  claimedLootKeys: string[];
  equipment: EquipmentPersistence;
  quests: QuestWorldPersistence;
  shopEconomy: ShopEconomyState;
  forge: ForgePersistence;
  repair: Pick<RepairTransactionState, 'repairTransactionKeys'>;
  interaction: WorldInteractionState;
  version: 1;
}

export function createGameRuntimeState(input: Omit<GameRuntimeState, 'version'>): GameRuntimeState {
  return { ...input, version: 1 };
}

export function patchGameRuntimeState(
  state: GameRuntimeState,
  patch: Partial<Omit<GameRuntimeState, 'version'>>,
): GameRuntimeState {
  return { ...state, ...patch, version: 1 };
}

export function syncCharacterInventory(state: GameRuntimeState): GameRuntimeState {
  return {
    ...state,
    game: {
      ...state.game,
      character: { ...state.game.character, equipment: state.inventory },
    },
  };
}
