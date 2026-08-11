import type { Character } from './types';
import { choosePartyActions, type PartyCombatant } from './party-ai-engine';
import type { WorldRuntime } from './world-runtime';
import { travelRisk } from './world-runtime';

export interface EncounterRuntime {
  allies: Character[];
  enemyPower: number;
  world: WorldRuntime;
  logs: string[];
}

export function resolvePartyTurn(runtime: EncounterRuntime) {
  const combatants: PartyCombatant[] = runtime.allies.map(c => ({ id:c.id, hp: Math.max(1, c.attributes.VIT*3), maxHp:Math.max(1,c.attributes.VIT*3), mana:Math.max(0,c.attributes.MAG*2), maxMana:Math.max(0,c.attributes.MAG*2), attack:c.attributes.STR+c.attributes.SKL, healingPower:c.attributes.MAG+c.attributes.INT, tactic:'balanced' as const }));
  const actions = choosePartyActions(combatants, runtime.enemyPower);
  const summary = actions.map(a => `${a.actorId}:${a.action}`).join(' · ');
  return { ...runtime, logs:[`Party turn resolved · ${summary}`, ...runtime.logs].slice(0,30) };
}

export function travelExposure(runtime: EncounterRuntime) {
  return Math.min(100, Math.round(travelRisk(runtime.world)*25 + runtime.enemyPower/10));
}
