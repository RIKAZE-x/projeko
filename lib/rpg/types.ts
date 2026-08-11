export type Rank = 'F'|'E'|'D'|'C'|'B'|'A'|'S'|'SS'|'SSS'|'EX'|'Ω';
export type MonsterRank = Rank | 'MYTHIC' | 'CALAMITY' | 'DIVINE';
export type Rarity = 'Broken'|'Common'|'Uncommon'|'Rare'|'Epic'|'Legendary'|'Mythic';
export type ItemCategory = 'Weapon'|'Armor'|'Accessory'|'Consumable'|'Material'|'Relic'|'Tool'|'Tome'|'Contract'|'Concept Item';
export type QualityBand = 'Defective'|'Poor'|'Normal'|'Fine'|'Excellent'|'Masterwork'|'Perfect';

export interface Material { id:string; name:string; hardness:number|null; durability:number|null; manaConductivity:number; weight:number; heatResistance?:number; fireAffinity?:number; voidAffinity?:number; realityStability?:number; }
export interface Affix { id:string; name:string; rank:number; description:string; }
export interface Trait { id:string; name:string; description:string; positive?:boolean; }
export interface Item { id:string; name:string; category:ItemCategory; baseType:string; material:Material; level:number; quality:number; rank:Rank; rarity:Rarity; affixes:Affix[]; traits:Trait[]; element?:string; soulResonance:number; history:{kills:number;ownerYears:number;notableEvents:string[]}; condition:number; ownerId?:string; }
export interface Skill { id:string; name:string; rank:Rank; tier:number; level:number; mastery:'Beginner'|'Practiced'|'Advanced'|'Perfect'|'Absolute'; authority:number; manaCost:number; description:string; limitations:string[]; evolution?:string; }
export interface Attributes { STR:number; VIT:number; MAG:number; SPD:number; INT:number; SKL:number; }
export interface Profession { id:string; name:string; level:number; xp:number; rank:Rank; branches:string[]; }
export interface CharacterRole { origin:string; core:string; rank:Rank; hiddenPotential?:string; trait?:Trait; traitHooks?:string[]; convictions:Record<string,number>; achievements:string[]; counters:Record<string,number>; }
export interface Character { id:string; name:string; race:string; level:number; xp:number; attributes:Attributes; profession:Profession; skills:Skill[]; equipment:Item[]; gold:number; reputation:number; role:CharacterRole; }
export interface Monster { id:string; name:string; rank:MonsterRank; level:number; hp:number; maxHp:number; attributes:Attributes&{THR:number}; skills:Skill[]; weaknesses:string[]; environmentBonus?:string; rewardXp:number; rewardGold:number; }
export interface EconomyState { inflation:number; trust:number; prices:Record<string,number>; treasuryReserves:{gold:number;mana:number}; }
export interface GameState { day:number; hour:number; location:string; character:Character; party:Character[]; activeMonster:Monster; economy:EconomyState; logs:string[]; }
