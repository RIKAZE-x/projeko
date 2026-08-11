import type { Attributes, Character } from './types';

export const PLAYABLE_RACES = ['Human','Elf','Dwarf','Beastkin','Dragonkin','Demonkin','Angelkin','Demon','Fairy','Spirit','Undead','Construct'] as const;
export type PlayableRace = typeof PLAYABLE_RACES[number];

const modifiers: Record<PlayableRace, Attributes> = {
 Human:{STR:10,VIT:10,MAG:10,SPD:10,INT:10,SKL:10},
 Elf:{STR:8,VIT:8,MAG:16,SPD:14,INT:14,SKL:14},
 Dwarf:{STR:15,VIT:16,MAG:8,SPD:7,INT:10,SKL:9},
 Beastkin:{STR:12,VIT:11,MAG:7,SPD:16,INT:8,SKL:12},
 Dragonkin:{STR:18,VIT:18,MAG:18,SPD:11,INT:13,SKL:10},
 Demonkin:{STR:13,VIT:12,MAG:17,SPD:12,INT:15,SKL:11},
 Angelkin:{STR:10,VIT:10,MAG:17,SPD:13,INT:16,SKL:12},
 Demon:{STR:17,VIT:16,MAG:19,SPD:12,INT:17,SKL:10},
 Fairy:{STR:4,VIT:5,MAG:18,SPD:18,INT:16,SKL:17},
 Spirit:{STR:5,VIT:6,MAG:20,SPD:15,INT:18,SKL:12},
 Undead:{STR:12,VIT:15,MAG:13,SPD:8,INT:13,SKL:8},
 Construct:{STR:16,VIT:20,MAG:10,SPD:5,INT:11,SKL:6},
};

export function createCharacter(name:string, race:PlayableRace):Character {
 const attributes=modifiers[race];
 return {id:`hero-${Date.now()}`,name,race,level:1,xp:0,gold:100,attributes,profession:{id:'wanderer',name:'Wanderer',level:1,xp:0,rank:'F',branches:[]},skills:[],equipment:[],reputation:0,role:{origin:'Wanderer',core:'Unawakened',rank:'F',convictions:{},achievements:[],counters:{}}};
}
