import type { Character, Trait } from './types';
import type { PlayableRace } from './character-creation';

export interface RaceTrait { id:string; name:string; description:string; hooks:string[]; hiddenPotential:string; }
export interface AwakeningResult { character:Character; trait:RaceTrait; role:string; narrative:string; }

const TRAITS:Record<PlayableRace,RaceTrait>={
 Human:{id:'adaptive-soul',name:'Adaptive Soul',description:'Gain faster proficiency growth when repeatedly practicing a new discipline.',hooks:['adaptive-learning','multi-profession'],hiddenPotential:'Jack-of-All-Trades'},
 Elf:{id:'echo-memory',name:'Echo Memory',description:'Investigation and lore actions can reveal ancestral clues.',hooks:['investigation','ancient-lore'],hiddenPotential:'Memory Sage'},
 Dwarf:{id:'stonebody',name:'Stonebody',description:'Armor and physical mitigation are naturally more efficient.',hooks:['smithing','material-mastery'],hiddenPotential:'Forge Sovereign'},
 Beastkin:{id:'predator-instinct',name:'Predator Instinct',description:'Improves threat detection and rewards successful hunts.',hooks:['hunting','tracking'],hiddenPotential:'Apex Predator'},
 Dragonkin:{id:'dragon-resonance',name:'Dragon Resonance',description:'Elemental actions can build resonance toward a later dragon evolution.',hooks:['elemental-resonance','dragon-form'],hiddenPotential:'Dragon Sovereign'},
 Demonkin:{id:'abyssal-ambition',name:'Abyssal Ambition',description:'High-risk actions can generate stronger role evolution pressure.',hooks:['curse-survival','abyss'],hiddenPotential:'Calamity Vessel'},
 Angelkin:{id:'radiant-soul',name:'Radiant Soul',description:'Protection and rescue actions strengthen conviction gains.',hooks:['protection','restoration'],hiddenPotential:'Saint of the Last Light'},
 Demon:{id:'predatory-core',name:'Predatory Core',description:'Defeating stronger enemies can accelerate combat mastery.',hooks:['sin','combat-mastery'],hiddenPotential:'Demon Lord'},
 Fairy:{id:'fae-momentum',name:'Fae Momentum',description:'Mobility, exploration and trickery actions build momentum.',hooks:['illusion','mobility'],hiddenPotential:'Fairy Sovereign'},
 Spirit:{id:'soul-echo',name:'Soul Echo',description:'Spirit interactions increase awareness of hidden world layers.',hooks:['spirit-talk','soulcraft'],hiddenPotential:'Soul Sovereign'},
 Undead:{id:'death-memory',name:'Death Memory',description:'Survival and soul-related actions leave permanent history marks.',hooks:['necromancy','death-affinity'],hiddenPotential:'Lord of the Dead'},
 Construct:{id:'core-identity',name:'Core Identity',description:'Equipment integration and system actions shape future role evolution.',hooks:['modular-body','core-evolution'],hiddenPotential:'Perfect Construct'},
};

const START_ROLES:Record<PlayableRace,string>={Human:'Wanderer',Elf:'Scholar',Dwarf:'Apprentice Smith',Beastkin:'Hunter',Dragonkin:'Drake Initiate',Demonkin:'Outcast',Angelkin:'Guardian',Demon:'Predator',Fairy:'Wayfarer',Spirit:'Echo-Bearer',Undead:'Gravewalker',Construct:'Corebound'};

export function awakenCharacter(character:Character):AwakeningResult {
 const race=character.race as PlayableRace;
 const profile=TRAITS[race] ?? TRAITS.Human;
 const role=START_ROLES[race] ?? 'Wanderer';
 const trait:Trait={id:profile.id,name:profile.name,description:profile.description};
 const next:Character={...character,role:{...character.role,core:role,trait,hiddenPotential:profile.hiddenPotential,traitHooks:profile.hooks,achievements:Array.from(new Set([...character.role.achievements,'first-awakening'])),counters:{...character.role.counters,awakening:1}}};
 return {character:next,trait:profile,role,narrative:`The Veil recognizes ${next.name} as ${role}. The ${profile.name} stirs within the soul. A hidden possibility exists: ${profile.hiddenPotential}.`};
}

export function getRaceTrait(race:PlayableRace){return TRAITS[race];}
