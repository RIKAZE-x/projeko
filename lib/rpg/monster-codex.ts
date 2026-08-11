export type MonsterRank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'EX' | 'Mythic' | 'Divine';
export type ThreatScale = 'Individual' | 'Squad' | 'Village' | 'City' | 'Kingdom' | 'Continental' | 'World' | 'Existential';

export interface MonsterDefinition {
  id: string;
  name: string;
  rank: MonsterRank;
  level: [number, number];
  type: string;
  role: string;
  habitat: string[];
  attributes: Partial<Record<'STR' | 'VIT' | 'AGI' | 'DEX' | 'INT' | 'MND' | 'MAG' | 'RES' | 'SEN' | 'FATE', number>>;
  skills: string[];
  weaknesses?: string[];
  drops?: string[];
  evolution?: string[];
  conditional?: { condition: string; rank: MonsterRank }[];
}

export const MONSTERS: MonsterDefinition[] = [
  { id: 'verdant-slime', name: 'Verdant Slime', rank: 'F', level: [1, 5], type: 'Ooze', role: 'Absorber', habitat: ['forest', 'swamp', 'cave'], attributes: { VIT: 8, RES: 5 }, skills: ['Acid Skin', 'Absorb', 'Split', 'Moisture Recovery'], weaknesses: ['Fire'], drops: ['Green Core', 'Acid Gel', 'Minor Mana Droplet'], evolution: ['Forest Slime', 'Ancient Slime', 'King Slime'] },
  { id: 'ember-slime', name: 'Ember Slime', rank: 'F', level: [3, 8], type: 'Elemental Ooze', role: 'DPS', habitat: ['volcanic cave'], attributes: { VIT: 11, MAG: 8, RES: 8 }, skills: ['Heat Body', 'Burning Splash', 'Ignite'], drops: ['Ember Core', 'Cinder Gel'], evolution: ['Cinder Slime', 'Inferno Slime'] },
  { id: 'moonlit-slime', name: 'Moonlit Slime', rank: 'E', level: [4, 10], type: 'Ooze', role: 'Controller', habitat: ['moonlit forest'], attributes: { VIT: 15, MAG: 12, RES: 12 }, skills: ['Moon Absorption', 'Lunar Regeneration', 'Reflective Body'], conditional: [{ condition: 'Full moon', rank: 'C' }] },
  { id: 'horned-rabbit', name: 'Horned Rabbit', rank: 'F', level: [2, 6], type: 'Beast', role: 'DPS', habitat: ['grassland', 'forest'], attributes: { STR: 5, AGI: 8, SEN: 7 }, skills: ['Leap', 'Horn Thrust', 'Danger Sense'] },
  { id: 'cave-rat', name: 'Cave Rat', rank: 'F', level: [1, 4], type: 'Beast', role: 'Swarm', habitat: ['cave', 'sewer'], attributes: { AGI: 5, SEN: 6 }, skills: ['Bite', 'Scavenge', 'Disease Carrier'], conditional: [{ condition: 'Colony exceeds 100', rank: 'D' }] },
  { id: 'dire-wolf-pup', name: 'Dire Wolf Pup', rank: 'E', level: [8, 14], type: 'Beast', role: 'DPS / Pack', habitat: ['forest', 'steppe'], attributes: { STR: 12, VIT: 11, AGI: 14, SEN: 13 }, skills: ['Pack Coordination', 'Bite', 'Howl'], conditional: [{ condition: 'Pack exceeds 10', rank: 'D' }] },
  { id: 'goblin-scout', name: 'Goblin Scout', rank: 'E', level: [7, 12], type: 'Humanoid', role: 'Assassin / Recon', habitat: ['forest', 'ruins'], attributes: { AGI: 11, DEX: 12, INT: 9, SEN: 12 }, skills: ['Trap Making', 'Stealth', 'Reconnaissance'] },
  { id: 'goblin-shaman', name: 'Goblin Shaman', rank: 'E', level: [9, 15], type: 'Humanoid', role: 'Mage / Support', habitat: ['goblin camps'], attributes: { INT: 12, MND: 10, MAG: 14 }, skills: ['Minor Curse', 'Earth Bolt', 'Healing Chant'] },
  { id: 'orc-raider', name: 'Orc Raider', rank: 'D', level: [20, 30], type: 'Humanoid', role: 'DPS', habitat: ['steppe', 'war camps'], attributes: { STR: 24, VIT: 23, AGI: 11, INT: 8 }, skills: ['Heavy Swing', 'Blood Rage', 'Pain Resistance'] },
  { id: 'stone-troll', name: 'Stone Troll', rank: 'C', level: [35, 50], type: 'Beast', role: 'Tank', habitat: ['mountains'], attributes: { STR: 34, VIT: 48, AGI: 7, RES: 35 }, skills: ['Stone Skin', 'Regeneration', 'Earthquake Punch'], weaknesses: ['Magic Penetration'] },
  { id: 'minotaur', name: 'Minotaur', rank: 'C', level: [45, 65], type: 'Beast', role: 'DPS / Boss', habitat: ['labyrinth'], attributes: { STR: 42, VIT: 38, AGI: 18, DEX: 24, SEN: 20 }, skills: ['Axe Mastery', 'Labyrinth Sense', 'Bull Charge', 'Berserk'] },
  { id: 'wyvern', name: 'Wyvern', rank: 'C', level: [55, 75], type: 'Dragon', role: 'Flying DPS', habitat: ['mountains', 'volcano'], attributes: { STR: 39, VIT: 34, AGI: 41, DEX: 29, RES: 25 }, skills: ['Dive Bomb', 'Wing Gust', 'Venom Breath'] },
  { id: 'death-knight', name: 'Death Knight', rank: 'C', level: [60, 80], type: 'Undead', role: 'Tank / DPS', habitat: ['crypt', 'battlefield'], attributes: { STR: 45, VIT: 43, MND: 36, RES: 40 }, skills: ['Soul Blade', 'Dark Armor', 'Death Aura'] },
  { id: 'spider-matriarch', name: 'Spider Matriarch', rank: 'B', level: [85, 110], type: 'Insect', role: 'Boss / Summoner', habitat: ['deep cave'], attributes: { STR: 42, VIT: 65, AGI: 35, MAG: 31, SEN: 44 }, skills: ['Void Web', 'Brood Command', 'Poison Fang', 'Egg Sacrifice'], conditional: [{ condition: 'Brood exceeds 10000', rank: 'A' }] },
  { id: 'ancient-troll', name: 'Ancient Troll', rank: 'B', level: [90, 120], type: 'Beast', role: 'Tank / Boss', habitat: ['mountain'], attributes: { STR: 72, VIT: 95, AGI: 12, RES: 70 }, skills: ['Regeneration', 'Troll Rage', 'Bone Reconstruction', 'Mountain Throw'] },
  { id: 'hydra', name: 'Hydra', rank: 'B', level: [100, 140], type: 'Beast', role: 'Boss', habitat: ['swamp', 'ancient lake'], attributes: { STR: 60, VIT: 100, AGI: 18, MAG: 55, RES: 80 }, skills: ['Head Regeneration', 'Adaptive Resistance', 'Multi-Bite'], weaknesses: ['Severed-heart mechanic'] },
  { id: 'storm-hydra', name: 'Storm Hydra', rank: 'A', level: [140, 180], type: 'Elemental Dragon', role: 'Boss', habitat: ['storm clouds'], attributes: { STR: 90, VIT: 120, AGI: 65, MAG: 110, RES: 100 }, skills: ['Thunder Heads', 'Storm Dominion', 'Lightning Breath'] },
  { id: 'void-behemoth', name: 'Void Behemoth', rank: 'SS', level: [300, 500], type: 'Void', role: 'World Boss', habitat: ['void scar'], attributes: { STR: 150, VIT: 200, AGI: 90, MAG: 180, RES: 220, MND: 20 }, skills: ['Void Devouring', 'Gravity Collapse', 'Spatial Roar'], weaknesses: ['Spiritual attacks'] },
  { id: 'world-serpent', name: 'World Serpent', rank: 'Mythic', level: [800, 1200], type: 'Divine Serpent', role: 'World Boss', habitat: ['world ocean'], attributes: { STR: 300, VIT: 500, MAG: 400, RES: 500, FATE: 100 }, skills: ['Sovereignty of Depth', 'World Coil', 'Abyssal Tide'], evolution: ['Primordial Ocean'] },
  { id: 'devouring-god', name: 'The Devouring God', rank: 'Divine', level: [9999, 9999], type: 'Divine', role: 'Existential Boss', habitat: ['system grave'], attributes: { STR: 999, VIT: 999, MAG: 999, RES: 999, MND: 999, FATE: 999 }, skills: ['Consume Mana', 'Consume Soul', 'Consume Dungeon', 'Consume Skill', 'Consume Life'], weaknesses: ['Unknown'] },
];

export const MONSTER_RANK_ORDER: MonsterRank[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'EX', 'Mythic', 'Divine'];

export function getMonster(id: string) {
  return MONSTERS.find((monster) => monster.id === id);
}

export function resolveConditionalRank(monster: MonsterDefinition, context: { fullMoon?: boolean; packSize?: number; colonySize?: number; broodSize?: number }) {
  if (!monster.conditional?.length) return monster.rank;
  for (const condition of monster.conditional) {
    if (condition.condition === 'Full moon' && context.fullMoon) return condition.rank;
    if (condition.condition === 'Pack exceeds 10' && (context.packSize ?? 0) > 10) return condition.rank;
    if (condition.condition === 'Colony exceeds 100' && (context.colonySize ?? 0) > 100) return condition.rank;
    if (condition.condition === 'Brood exceeds 10000' && (context.broodSize ?? 0) > 10000) return condition.rank;
  }
  return monster.rank;
}
