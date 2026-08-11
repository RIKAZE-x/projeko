import type { Character, CharacterRole } from './types';
import { applyEvolution, discoverEvolutions, type EvolutionRule, type RoleState } from './role-system';

export interface EvolutionEvent {
  from:string;
  to:string;
  layer:'Core'|'Path'|'Soul'|'Fate'|'Sin'|'True';
  narrative:string;
}

function layerFor(rule:EvolutionRule):EvolutionEvent['layer'] {
  if (/Truth|Kingmaker|Rebel/.test(rule.to)) return 'Soul';
  if (/Lord of|Sovereign|Protector|Executioner|Knight/.test(rule.to)) return 'Path';
  return 'Core';
}

function toRoleState(role:CharacterRole):RoleState {
  return { origin:role.origin, core:role.core, rank:role.rank as RoleState['rank'], convictions:role.convictions, achievements:role.achievements, counters:role.counters };
}

function fromRoleState(role:RoleState, source:CharacterRole):CharacterRole {
  return { ...source, origin:role.origin, core:role.core, rank:role.rank as CharacterRole['rank'], convictions:role.convictions, achievements:role.achievements, counters:role.counters };
}

export function evolutionCandidates(character:Character):EvolutionRule[] {
  return discoverEvolutions(toRoleState(character.role));
}

export function evolveCharacter(character:Character, rule:EvolutionRule):{character:Character;event:EvolutionEvent} {
  const nextRole=applyEvolution(toRoleState(character.role),rule);
  const next:Character={...character,role:fromRoleState(nextRole,character.role)};
  const layer=layerFor(rule);
  return {character:next,event:{from:rule.from,to:rule.to,layer,narrative:`The Veil records a new identity: ${rule.to}. Your actions have changed the shape of your destiny.`}};
}
