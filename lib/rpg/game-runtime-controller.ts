import type { GameRuntimeState } from './game-runtime-state';
import { patchGameRuntimeState } from './game-runtime-state';
import type { DungeonAction } from './dungeon-interaction-router';
import { beginInteraction, closeInteraction, type WorldInteractionState } from './world-interaction-controller';

export interface RuntimeEvent {
  type: 'move' | 'interaction-start' | 'interaction-close' | 'combat-victory' | 'combat-defeat' | 'loot-claimed' | 'shop-purchase' | 'forge-complete' | 'repair-complete';
  payload?: unknown;
}

export function applyRuntimeEvent(state: GameRuntimeState, event: RuntimeEvent): GameRuntimeState {
  switch (event.type) {
    case 'interaction-start':
      return patchGameRuntimeState(state, {
        interaction: beginInteraction(state.interaction, event.payload as DungeonAction),
      });
    case 'interaction-close':
      return patchGameRuntimeState(state, { interaction: closeInteraction(state.interaction) });
    default:
      return state;
  }
}

export function updateInteraction(state: GameRuntimeState, action: DungeonAction): GameRuntimeState {
  return patchGameRuntimeState(state, {
    interaction: beginInteraction(state.interaction, action),
  });
}

export function resetInteraction(state: GameRuntimeState): GameRuntimeState {
  return patchGameRuntimeState(state, { interaction: closeInteraction(state.interaction) });
}
