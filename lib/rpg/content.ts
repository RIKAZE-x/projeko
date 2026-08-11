import type { Affix, Character, Item, Material, Monster, Skill } from './types';

export const materials: Material[] = [
  { id:'iron', name:'Iron', hardness:42, durability:55, manaConductivity:12, weight:60, heatResistance:31 },
  { id:'mithril', name:'Mithril', hardness:71, durability:68, manaConductivity:94, weight:18 },
  { id:'dragon-bone', name:'Dragon Bone', hardness:87, durability:91, manaConductivity:63, weight:24, fireAffinity:100 },
  { id:'void-metal', name:'Void Metal', hardness:null, durability:null, manaConductivity:0, weight:1, voidAffinity:100, realityStability:-23 },
];
export const affixes: Affix[] = [
  { id:'sharpness-2', name:'Sharpness II', rank:2, description:'+12% physical damage and penetration.' },
  { id:'mana-conduction-1', name:'Mana Conduction I', rank:1, description:'+10% mana conductivity.' },
  { id:'vitality-3', name:'Vitality III', rank:3, description:'+9% maximum HP.' },
  { id:'hunter-1', name:'Hunter I', rank:1, description:'+8% damage against monsters.' },
];
export const skills: Skill[] = [
  { id:'basic-swordsmanship', name:'Basic Swordsmanship', rank:'F', tier:1, level:8, mastery:'Advanced', authority:0, manaCost:0, description:'Efficient sword fundamentals.', limitations:['Requires a bladed weapon.'], evolution:'Swordsmanship' },
  { id:'flame-blade', name:'Flame Blade', rank:'D', tier:3, level:5, mastery:'Practiced', authority:2, manaCost:14, description:'Coats the weapon in unstable fire.', limitations:['Water magic reduces stability.','Mana Drain is highly effective.'], evolution:'Inferno Edge' },
  { id:'shadow-step', name:'Shadow Step', rank:'C', tier:4, level:3, mastery:'Advanced', authority:5, manaCost:22, description:'Move through shadows within 30 meters.', limitations:['Requires a usable shadow.','Blocked by anti-teleport barriers.'], evolution:'Advanced Shadow Step' },
  { id:'dragon-slayer', name:'Dragon Slayer', rank:'B', tier:5, level:1, mastery:'Beginner', authority:8, manaCost:18, description:'Conditional power against Dragon-aligned creatures.', limitations:['Effective power depends on target alignment.'], evolution:'Dragon Sovereign' },
];
const iron = materials[0];
const mithril = materials[1];
export const items: Item[] = [
  { id:'embersteel-longsword', name:'Embersteel Longsword', category:'Weapon', baseType:'Long Sword', material:iron, level:18, quality:92, rank:'C', rarity:'Rare', affixes:[affixes[0],affixes[1]], traits:[{id:'blood-hungry',name:'Blood-Hungry',description:'Gains a small temporary attack bonus after a kill.',positive:true}], element:'Fire', soulResonance:13, history:{kills:42,ownerYears:2,notableEvents:['Survived the Ashen Bell expedition']},condition:91 },
  { id:'astral-focus', name:'Astral Focus', category:'Tome', baseType:'Grimoire', material:mithril, level:20, quality:97, rank:'B', rarity:'Epic', affixes:[affixes[1]], traits:[{id:'star-memory',name:'Star Memory',description:'Stores one additional high-tier spell pattern.',positive:true}], element:'Astral', soulResonance:27, history:{kills:0,ownerYears:1,notableEvents:['Copied from an Arclight archive']},condition:98 },
  { id:'perfect-iron-dagger', name:'Perfect Iron Dagger', category:'Weapon', baseType:'Dagger', material:iron, level:4, quality:100, rank:'E', rarity:'Common', affixes:[affixes[0]], traits:[], soulResonance:0, history:{kills:3,ownerYears:0,notableEvents:['Masterwork apprentice test']},condition:100 },
];
const role=(origin:string,core:string)=>({origin,core,rank:'F' as const,convictions:{},achievements:[],counters:{}});
export const aren: Character = {
  id:'aren-vey-l', name:'Auren Veyl', race:'Human', level:18, xp:7320, attributes:{STR:42,VIT:38,MAG:17,SPD:31,INT:24,SKL:35},
  profession:{id:'blade-warden',name:'Blade Warden',level:12,xp:2840,rank:'C',branches:['Knight','Warden','Spellblade']}, skills:[skills[0],skills[1]], equipment:[items[0]], gold:4820, reputation:64, role:role('Wanderer','Blade Warden'),
};
export const lyra: Character = {
  id:'lyra-valen', name:'Lyra Valen', race:'Aelari', level:17, xp:6980, attributes:{STR:12,VIT:24,MAG:51,SPD:29,INT:48,SKL:39},
  profession:{id:'astral-mage',name:'Astral Mage',level:14,xp:3410,rank:'C',branches:['Arcanist','Oracle','Astral Mage']}, skills:[skills[2]], equipment:[items[1]], gold:5210, reputation:71, role:role('Memory Child','Astral Scholar'),
};
export const kael: Character = {
  id:'kael-ardyn', name:'Kael Ardyn', race:'Human', level:16, xp:6030, attributes:{STR:28,VIT:29,MAG:19,SPD:48,INT:34,SKL:44},
  profession:{id:'night-ranger',name:'Night Ranger',level:13,xp:3120,rank:'C',branches:['Ranger','Assassin','Beast Hunter']}, skills:[skills[3]], equipment:[items[2]], gold:3910, reputation:52, role:role('Wanderer','Night Hunter'),
};
export const monsters: Monster[] = [
  { id:'grave-wisp', name:'Grave Wisp', rank:'D', level:22, hp:420, maxHp:420, attributes:{STR:14,VIT:25,MAG:39,SPD:42,INT:31,SKL:36,THR:28}, skills:[skills[2]], weaknesses:['Fire','Radiance'], rewardXp:380, rewardGold:74 },
  { id:'minotaur-warlord', name:'Minotaur Warlord', rank:'C', level:54, hp:1600, maxHp:1600, attributes:{STR:58,VIT:51,MAG:17,SPD:33,INT:41,SKL:48,THR:57}, skills:[skills[0]], weaknesses:['Illusion','Piercing'], environmentBonus:'Labyrinth Sovereignty', rewardXp:1600, rewardGold:330 },
  { id:'hydra', name:'Hydra', rank:'B', level:96, hp:5400, maxHp:5400, attributes:{STR:72,VIT:88,MAG:46,SPD:24,INT:28,SKL:71,THR:86}, skills:[skills[1]], weaknesses:['Regeneration suppression'], environmentBonus:'Adaptive Resistance', rewardXp:8200, rewardGold:1800 },
];
export const world = { continents:7, seas:9, majorPowers:12, autonomousRegions:31, majorCities:48, mediumCities:117, importantVillages:'700+', registeredDungeons:3800, zones:['Central Heartland','Aelari Wilds','Dhurak Mountains','Varkhan Steppe','Dravari Volcanic Belt','Nymari Seas','Sylphid Skylands','Myr Desert','Noctari Underworld','Astraen Reach','Construct Ruins','Southern Wilds'], capitals:['Valerion','Prime','Arclight','Ironwall','Goldmere'] };
