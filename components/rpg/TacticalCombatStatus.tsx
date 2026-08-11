'use client';
import type { TacticalCombatState } from '../../lib/rpg/tactical-combat-engine';

export function TacticalCombatStatus({state}:{state:TacticalCombatState}){
 return <div className="tactical-combat-status">
  <span>Turn {state.turn}</span>
  <span>HP {state.playerHp}/{state.playerMaxHp}</span>
  <span>Enemy {state.enemyHp}/{state.enemyMaxHp}</span>
  <span>{state.result.toUpperCase()}</span>
  {Object.entries(state.cooldowns).map(([id,value])=><span key={id}>{id}: CD {value}</span>)}
  {state.statuses.map(s=><span key={s.id}>{s.id} {s.remaining}</span>)}
 </div>;
}
