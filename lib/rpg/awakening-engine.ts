import type { Character } from './types';
import type { PlayableRace } from './character-creation';

export interface RaceTrait { id:string; name:string; description:string; }
export interface AwakeningResult { character:Character; trait:RaceTrait; role:string; narrative:string; }

const TRAITS:Record<PlayableRace,RaceTrait>={
 Human:{id:'adaptive-soul',name:'Adaptive Soul',description:'Gain faster proficiency growth when repeatedly practicing a new discipline.'},
 Elf:{id:'echo-memory',name:'Echo Memory',description:'Investigation and lore actions can reveal ancestral clues.'},
 Dwarf:{id:'stonebody',name:'Stonebody',description:'Armor and physical mitigation are naturally more efficient.'},
 Beastkin:{id:'predator-instinct',name:'Predator Instinct',description:'Improves threat detection and rewards successful hunts.'},
 Dragonkin:{id:'dragon-resonance',name:'Dragon Resonance',description:'Elemental actions can build resonance toward a later dragon evolution.'},
 Demonkin:{id:'abyssal-ambition',name:'Abyssal Ambition',description:'High-risk actions can generate stronger role evolution pressure.'},
 Angelkin:{id:'radiant-soul',name:'Radiant Soul',description:'Protection and rescue actions strengthen conviction gains.'},
 Demon:{id:'predatory-core',name:'Predatory Core',description:'Defeating stronger enemies can accelerate combat mastery.'},
 Fairy:{id:'fae-momentum',name:'Fae Momentum',description:'Mobility, exploration and trickery actions build momentum.'},
 Spirit:{id:'soul-echo',name:'Soul Echo',description:'Spirit interactions increase awareness of hidden world layers.'},
 Undead:{id:'death-memory',name:'Death Memory',description:'Survival and soul-related actions leave permanent history marks.'},
 Construct:{id:'core-identity',name:'Core Identity',description:'Equipment integration and system actions shape future role evolution.'},
};

const START_ROLES:Partial<Record<PlayableRace,string>>={Human:'Wanderer',Elf:'Scholar',Dwarf:'Apprentice Smith',Beastkin:'Hunter',Dragonkin:'Drake Initiate',Demonkin:'Outcast',Angelkin:'Guardian',Demon:'Predator',Fairy:'Wayfarer',Spirit:'Echo-Bearer',Undead:'Gravewalker',Construct:'Corebound'};

export function awakenCharacter(character:Character):AwakeningResult {
 const race=character.race as PlayableRace;
 const trait=TRAITS[race] ?? TRAITS.Human;
 const role=START_ROLES[race] ?? 'Wanderer';
 const next:Character={...character,role:{...character.role,core:role,achievements:[...character.role.achievements,'first-awakening'],counters:{...character.role.counters,awakening:1}}};
 return {character:next,trait,role,narrative:`The Veil recognizes ${next.name} as ${role}. The first thread of destiny has formed.`};
}

export function getRaceTrait(race:PlayableRace){return TRAITS[race];}
