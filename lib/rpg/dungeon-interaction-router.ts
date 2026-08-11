import type { InteractableKind, WorldInteractable, WorldEnemySpawn } from './dungeon-room-runtime';

export type DungeonAction =
  | { type: 'npc-dialogue'; targetId: string }
  | { type: 'shop'; targetId: string }
  | { type: 'forge'; targetId: string }
  | { type: 'chest'; targetId: string }
  | { type: 'exit'; targetId: string }
  | { type: 'combat'; targetId: string; monsterId: string };

export function routeInteractable(target: WorldInteractable): DungeonAction {
  const map: Record<InteractableKind, DungeonAction['type']> = {
    npc: 'npc-dialogue',
    shop: 'shop',
    forge: 'forge',
    chest: 'chest',
    exit: 'exit',
  };
  return { type: map[target.kind], targetId: target.id } as DungeonAction;
}

export function routeEnemy(enemy: WorldEnemySpawn): DungeonAction {
  return { type: 'combat', targetId: enemy.id, monsterId: enemy.monsterId };
}
