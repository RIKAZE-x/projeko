import type { Item, Material, Rarity } from './types';
import { generateLoot } from './loot-engine';
import { rollLootDrop, type LootDrop } from './loot-table';

export interface GeneratedDrop {
  sourceId: string;
  tableDrop: LootDrop;
  item?: Item;
}

export interface LootMaterial extends Material {
  id: string;
}

const MATERIALS: Record<string, LootMaterial> = {
  iron: { id: 'iron', name: 'Iron', tier: 1 } as LootMaterial,
  ember: { id: 'ember', name: 'Embersteel', tier: 3 } as LootMaterial,
  mana: { id: 'mana', name: 'Mana Crystal', tier: 4 } as LootMaterial,
  void: { id: 'void', name: 'Voidglass', tier: 6 } as LootMaterial,
};

function materialForDrop(dropId: string): LootMaterial {
  const key = dropId.includes('mana') ? 'mana' : dropId.includes('ember') || dropId.includes('crown') ? 'ember' : dropId.includes('veil') ? 'void' : 'iron';
  return MATERIALS[key];
}

export function materialFromDrop(drop: LootDrop): LootMaterial {
  return materialForDrop(drop.id);
}

export function rarityFromDrop(drop: LootDrop): Rarity {
  return drop.rarity;
}

export function generateEquipmentFromDrop(seed: number, level: number, drop: LootDrop): Item | undefined {
  if (drop.type !== 'equipment') return undefined;
  const material = materialForDrop(drop.id);
  return generateLoot(seed, Math.max(level, drop.minLevel), material, drop.baseType ?? 'Greatsword');
}

export function resolveLootDrop(seed: number, sourceId: string, level: number, index = 0): GeneratedDrop | null {
  const drop = rollLootDrop(seed, sourceId, index);
  if (!drop) return null;
  return { sourceId, tableDrop: drop, item: generateEquipmentFromDrop(seed + index * 97, level, drop) };
}
