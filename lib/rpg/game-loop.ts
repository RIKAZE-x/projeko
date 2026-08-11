import type { GameState, Character, Item, Material } from './types';
import { generateDungeon, dungeonEncounter } from './dungeon-engine';
import { generateLoot } from './loot-engine';
import { applyStatus, type StatusEffect } from './status-engine';

const FALLBACK_IRON: Material = { id: 'iron', name: 'Iron', hardness: 42, durability: 55, manaConductivity: 12, weight: 60, heatResistance: 31 };

export interface RuntimeState { game: GameState; dungeonSeed: number; roomIndex: number; statuses: StatusEffect[]; log: string[]; }

export function createRuntime(game: GameState, seed = Date.now()): RuntimeState {
  return { game, dungeonSeed: seed, roomIndex: 0, statuses: [], log: ['The expedition begins.'] };
}

export function activeDungeon(runtime: RuntimeState) { return generateDungeon(runtime.dungeonSeed, 'C', 12); }

export function enterNextRoom(runtime: RuntimeState): RuntimeState {
  const dungeon = activeDungeon(runtime);
  const room = dungeon.rooms[Math.min(runtime.roomIndex, dungeon.rooms.length - 1)];
  const encounter = dungeonEncounter(room, runtime.dungeonSeed + runtime.roomIndex);
  const log = [`Entered ${room.kind} room. Danger ${encounter.encounterPower}.`, ...runtime.log].slice(0, 30);
  return { ...runtime, roomIndex: Math.min(runtime.roomIndex + 1, dungeon.rooms.length - 1), log };
}

export function resolveCombat(runtime: RuntimeState, character: Character, enemyPower: number): RuntimeState {
  const damage = Math.max(1, character.attributes.STR + character.attributes.SKL - Math.floor(enemyPower / 3));
  const retaliation = Math.max(1, Math.floor(enemyPower / 5));
  const statuses = applyStatus(runtime.statuses, { id: retaliation > 20 ? 'Bleed' : 'Burn', duration: 2, stacks: 1, power: Math.max(1, Math.floor(retaliation / 4)), source: 'dungeon' });
  return { ...runtime, statuses, log: [`You dealt ${damage} damage and suffered ${retaliation} retaliation.`, ...runtime.log].slice(0, 30) };
}

export function claimTreasure(runtime: RuntimeState, character: Character): { runtime: RuntimeState; item: Item } {
  const material = character.equipment[0]?.material ?? FALLBACK_IRON;
  const item = generateLoot(runtime.dungeonSeed + runtime.roomIndex, character.level, material);
  return { runtime: { ...runtime, log: [`Found ${item.name}.`, ...runtime.log].slice(0, 30) }, item };
}
