import type { Character } from './types';

export const PLAYABLE_RACES = ['Human','Elf','Dwarf','Beastkin','Dragonkin','Demonkin','Angelkin','Demon','Fairy','Spirit','Undead','Construct'] as const;
export type PlayableRace = typeof PLAYABLE_RACES[number];

const modifiers: Record<PlayableRace, Partial<Character['attributes']>> = {
 Human:{STR:10,VIT:10,AGI:10,DEX:10,INT:10,MND:10,MAG:10,RES:10,SEN:10,FATE:12},
 Elf:{STR:8,VIT:8,AGI:14,DEX:14,INT:14,MND:12,MAG:16,RES:10,SEN:15,FATE:10},
 Dwarf:{STR:15,VIT:16,AGI:7,DEX:9,INT:10,MND:11,MAG:8,RES:16,SEN:8,FATE:8},
 Beastkin:{STR:12,VIT:11,AGI:16,DEX:12,INT:8,MND:9,MAG:7,RES:9,SEN:18,FATE:10},
 Dragonkin:{STR:18,VIT:18,AGI:11,DEX:10,INT:13,MND:12,MAG:18,RES:18,SEN:11,FATE:12},
 Demonkin:{STR:13,VIT:12,AGI:12,DEX:11,INT:15,MND:10,MAG:17,RES:12,SEN:12,FATE:13},
 Angelkin:{STR:10,VIT:10,AGI:13,DEX:12,INT:16,MND:17,MAG:17,RES:15,SEN:15,FATE:16},
 Demon:{STR:17,VIT:16,AGI:12,DEX:10,INT:17,MND:8,MAG:19,RES:14,SEN:10,FATE:7},
 Fairy:{STR:4,VIT:5,AGI:18,DEX:17,INT:16,MND:14,MAG:18,RES:8,SEN:20,FATE:18},
 Spirit:{STR:5,VIT:6,AGI:15,DEX:12,INT:18,MND:19,MAG:20,RES:18,SEN:17,FATE:15},
 Undead:{STR:12,VIT:15,AGI:8,DEX:8,INT:13,MND:6,MAG:13,RES:19,SEN:7,FATE:4},
 Construct:{STR:16,VIT:20,AGI:5,DEX:6,INT:11,MND:10,MAG:10,RES:20,SEN:3,FATE:2},
};

export function createCharacter(name:string, race:PlayableRace):Character {
 const attributes={...modifiers[race]};
 return {id:`hero-${Date.now()}`,name,race,level:1,exp:0,gold:100,attributes,inventory:[],skills:[],equipment:{},statusEffects:[],role:{origin:'Wanderer',core:'Unawakened',rank:'F',convictions:{},achievements:[],counters:{}}};
}
