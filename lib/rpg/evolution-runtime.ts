import type { Character } from './types';
import { applyEvolution, discoverEvolutions, type EvolutionRule, type RoleState } from './role-system';

export interface EvolutionEvent { from:string; to:string; layer:'Core'|'Path'|'Soul'|'Fate'|'Sin'|'True'; narrative:string; }

function layerFor(rule:EvolutionRule):EvolutionEvent['layer'] {
  if (/Truth|Kingmaker|Rebel/.test(rule.to)) return 'Soul';
  if (/Lord of|Sovereign|Protector|Executioner|Knight/.test(rule.to)) return 'Path';
  return 'Core';
}

export function evolutionCandidates(character:Character):EvolutionRule[] {
  return discoverEvolutions(character.role as RoleState);
}

export function evolveCharacter(character:Character, rule:EvolutionRule):{character:Character;event:EvolutionEvent} {
  const nextRole=applyEvolution(character.role as RoleState,rule);
  const layer=layerFor(rule);
  const next:Character={...character,role:nextRole,logs:[...(character.logs??[]),`Role evolved: ${rule.from} → ${rule.to}`]};
  return {character:next,event:{from:rule.from,to:rule.to,layer,narrative:`The Veil records a new identity: ${rule.to}. Your actions have changed the shape of your destiny.`}};
}
