import type { Character } from './types';
import { evolutionCandidates, evolveCharacter, type EvolutionEvent } from './evolution-runtime';

export interface EvolutionCeremony { eligible:boolean; candidates:string[]; selected?:string; event?:EvolutionEvent; narrative:string; }

export function inspectEvolution(character:Character):EvolutionCeremony {
 const candidates=evolutionCandidates(character);
 return {eligible:candidates.length>0,candidates:candidates.map(c=>c.to),narrative:candidates.length?'The Veil has recognized a possible new identity.':'No evolution has been recognized yet.'};
}

export function performEvolution(character:Character, target:string):{character:Character;ceremony:EvolutionCeremony} {
 const rule=evolutionCandidates(character).find(r=>r.to===target);
 if(!rule) throw new Error(`Evolution unavailable: ${target}`);
 const result=evolveCharacter(character,rule);
 return {character:result.character,ceremony:{eligible:true,candidates:[target],selected:target,event:result.event,narrative:result.event.narrative}};
}
