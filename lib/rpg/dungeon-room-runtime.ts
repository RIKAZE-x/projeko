export type WorldTile = 'floor' | 'wall' | 'water' | 'door' | 'stairs';
export type InteractableKind = 'npc' | 'shop' | 'forge' | 'chest' | 'exit';

export interface GridPos { x: number; y: number; }
export interface WorldInteractable { id: string; kind: InteractableKind; pos: GridPos; label: string; locked?: boolean; }
export interface WorldEnemySpawn { id: string; pos: GridPos; monsterId: string; defeated?: boolean; }

export interface DungeonRoom {
  id: string;
  width: number;
  height: number;
  tiles: WorldTile[];
  playerStart: GridPos;
  interactables: WorldInteractable[];
  enemies: WorldEnemySpawn[];
}

export interface DungeonRoomRuntime { room: DungeonRoom; player: GridPos; discoveredRoomIds: string[]; }

export function tileAt(room: DungeonRoom, pos: GridPos): WorldTile | null {
  if (pos.x < 0 || pos.y < 0 || pos.x >= room.width || pos.y >= room.height) return null;
  return room.tiles[pos.y * room.width + pos.x] ?? null;
}

export function canWalk(room: DungeonRoom, pos: GridPos): boolean {
  const tile = tileAt(room, pos);
  return tile !== null && tile !== 'wall' && tile !== 'water';
}

export function movePlayer(state: DungeonRoomRuntime, delta: GridPos): DungeonRoomRuntime {
  const next = { x: state.player.x + delta.x, y: state.player.y + delta.y };
  return canWalk(state.room, next) ? { ...state, player: next } : state;
}

export function interactAt(state: DungeonRoomRuntime): WorldInteractable | undefined {
  return state.room.interactables.find((item) => item.pos.x === state.player.x && item.pos.y === state.player.y && !item.locked);
}

export function enemyAt(state: DungeonRoomRuntime): WorldEnemySpawn | undefined {
  return state.room.enemies.find((enemy) => !enemy.defeated && enemy.pos.x === state.player.x && enemy.pos.y === state.player.y);
}

export function markRoomDiscovered(state: DungeonRoomRuntime): DungeonRoomRuntime {
  return state.discoveredRoomIds.includes(state.room.id) ? state : { ...state, discoveredRoomIds: [...state.discoveredRoomIds, state.room.id] };
}

export function markEnemyDefeated(state: DungeonRoomRuntime, enemyId: string): DungeonRoomRuntime {
  return { ...state, room: { ...state.room, enemies: state.room.enemies.map((enemy) => enemy.id === enemyId ? { ...enemy, defeated: true } : enemy) } };
}

export function createStarterRoom(seed: number): DungeonRoom {
  const width = 12;
  const height = 8;
  const tiles: WorldTile[] = Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return x === 0 || y === 0 || x === width - 1 || y === height - 1 ? 'wall' : 'floor';
  });
  tiles[2 * width + 10] = 'door';
  tiles[5 * width + 10] = 'stairs';
  return {
    id: `room-${seed}-0`,
    width,
    height,
    tiles,
    playerStart: { x: 1, y: 1 },
    interactables: [
      { id: 'npc-quartermaster', kind: 'npc', pos: { x: 3, y: 2 }, label: 'Quartermaster' },
      { id: 'shop-quartermaster', kind: 'shop', pos: { x: 4, y: 2 }, label: 'Shop' },
      { id: 'forge-ember', kind: 'forge', pos: { x: 6, y: 2 }, label: 'Forge' },
      { id: 'chest-starter', kind: 'chest', pos: { x: 8, y: 5 }, label: 'Chest' },
      { id: 'exit-stairs', kind: 'exit', pos: { x: 10, y: 5 }, label: 'Stairs' },
    ],
    enemies: [
      { id: 'slime-01', monsterId: 'slime-01', pos: { x: 8, y: 2 } },
      { id: 'wisp-01', monsterId: 'wisp-01', pos: { x: 5, y: 5 } },
    ],
  };
}

export function createDungeonRoomRuntime(seed: number): DungeonRoomRuntime {
  const room = createStarterRoom(seed);
  return { room, player: { ...room.playerStart }, discoveredRoomIds: [room.id] };
}
