import type { Character } from './types';
import { awakenCharacter } from './awakening-engine';

export function ensureAwakened(character:Character){
  if(character.role.achievements.includes('first-awakening')) return character;
  return awakenCharacter(character).character;
}

export function recordAction(character:Character, action:string, amount=1):Character {
  const current=ensureAwakened(character);
  const hook=current.role.traitHooks?.includes(action) ? amount*2 : amount;
  return {...current,role:{...current.role,counters:{...current.role.counters,[action]:(current.role.counters[action]??0)+hook}}};
}

export function rolePressure(character:Character){
  const current=ensureAwakened(character);
  const counters=current.role.counters;
  const values=Object.values(counters);
  const total=values.reduce((a,b)=>a+b,0);
  return Math.min(100,Math.floor(total/10));
}
