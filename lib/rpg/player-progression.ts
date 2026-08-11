import type { Character } from './types';

export const XP_PER_LEVEL_BASE = 1000;
export function xpToNextLevel(level:number){return XP_PER_LEVEL_BASE + (level-1)*350;}
export function canLevel(character:Character){return character.xp>=xpToNextLevel(character.level);}
export function levelUp(character:Character):Character{
 if(!canLevel(character)) return character;
 const needed=xpToNextLevel(character.level);
 return {...character,level:character.level+1,xp:character.xp-needed,attributes:{...character.attributes,STR:character.attributes.STR+2,VIT:character.attributes.VIT+2,MAG:character.attributes.MAG+2,SPD:character.attributes.SPD+1,INT:character.attributes.INT+1,SKL:character.attributes.SKL+2}};
}
export function grantCombatXp(character:Character,amount:number){
 let next={...character,xp:character.xp+amount};
 while(canLevel(next)) next=levelUp(next);
 return next;
}
