import type { Character, GameState, Item, Monster, QualityBand, Rank } from './types';
import { monsters } from './content';

export function qualityBand(value:number): QualityBand {
  if (value < 20) return 'Defective';
  if (value < 40) return 'Poor';
  if (value < 60) return 'Normal';
  if (value < 75) return 'Fine';
  if (value < 90) return 'Excellent';
  if (value < 98) return 'Masterwork';
  return 'Perfect';
}

export function itemPower(item:Item):number {
  const material = item.material;
  const base = item.baseType === 'Greatsword' ? 30 : item.baseType === 'Dagger' ? 18 : 24;
  const quality = 0.5 + item.quality / 100;
  const rankBonus = rankValue(item.rank) * 4;
  const materialBonus = (material.hardness ?? 50) / 5 + material.manaConductivity / 10;
  const condition = item.condition / 100;
  return Math.round((base + rankBonus + materialBonus) * quality * condition);
}

export function rankValue(rank:Rank):number {
  return ['F','E','D','C','B','A','S','SS','SSS','EX','Ω'].indexOf(rank) + 1;
}

export function effectiveDamage(attacker:Character, target:Monster, item:Item, skillMultiplier=1):number {
  const weapon = itemPower(item);
  const raw = attacker.attributes.STR * 1.25 + attacker.attributes.SKL * 0.45 + weapon;
  const hunter = item.affixes.some(a => a.name.startsWith('Hunter')) ? 1.08 : 1;
  return Math.max(1, Math.round(raw * skillMultiplier * hunter - target.attributes.VIT * 0.42));
}

export function resolveAttack(state:GameState, skillMultiplier=1):GameState {
  const { character, activeMonster } = state;
  const weapon = character.equipment.find(i => i.category === 'Weapon');
  if (!weapon) return pushLog(state, 'No weapon equipped.');
  const damage = effectiveDamage(character, activeMonster, weapon, skillMultiplier);
  const hp = Math.max(0, activeMonster.hp - damage);
  const retaliation = Math.max(0, Math.round(activeMonster.attributes.STR * 0.38 - character.attributes.VIT * 0.12));
  const nextCharacter = { ...character };
  const nextMonster = { ...activeMonster, hp };
  const next = { ...state, character: nextCharacter, activeMonster: nextMonster };
  if (hp === 0) {
    next.character = { ...character, xp: character.xp + activeMonster.rewardXp, gold: character.gold + activeMonster.rewardGold };
    next.activeMonster = nextMonster;
    return pushLog(next, `${character.name} defeats ${activeMonster.name}: +${activeMonster.rewardXp} XP, +${activeMonster.rewardGold} gold.`);
  }
  return pushLog(next, `${character.name} deals ${damage} damage. ${activeMonster.name} retaliates for ${retaliation}.`);
}

export function spawnMonster(index=Math.floor(Math.random()*monsters.length)):Monster { return structuredClone(monsters[index % monsters.length]); }
export function pushLog(state:GameState, text:string):GameState { return { ...state, logs:[text,...state.logs].slice(0,20) }; }
