import type { BossCombatState } from './boss-combat-engine';
import { nextBossTurn } from './boss-combat-engine';

export type TacticalResult='ongoing'|'victory'|'defeat';
export interface TacticalStatus { id:string; remaining:number; }
export interface TacticalCombatState {
  turn:number;
  result:TacticalResult;
  playerHp:number;
  playerMaxHp:number;
  enemyHp:number;
  enemyMaxHp:number;
  cooldowns:Record<string,number>;
  statuses:TacticalStatus[];
  boss?:BossCombatState;
}

export function tickCooldowns(cooldowns:Record<string,number>):Record<string,number>{
  return Object.fromEntries(Object.entries(cooldowns).map(([id,value])=>[id,Math.max(0,value-1)]));
}
export function tickStatuses(statuses:TacticalStatus[]):TacticalStatus[]{
  return statuses.map(s=>({...s,remaining:s.remaining-1})).filter(s=>s.remaining>0);
}
export function canCast(cooldowns:Record<string,number>,skillId:string){return (cooldowns[skillId]??0)<=0;}
export function applyPlayerDamage(state:TacticalCombatState,damage:number):TacticalCombatState{
  const playerHp=Math.max(0,state.playerHp-damage);
  return {...state,playerHp,result:playerHp<=0?'defeat':state.enemyHp<=0?'victory':'ongoing'};
}
export function applyEnemyDamage(state:TacticalCombatState,damage:number):TacticalCombatState{
  const enemyHp=Math.max(0,state.enemyHp-damage);
  return {...state,enemyHp,result:enemyHp<=0?'victory':state.playerHp<=0?'defeat':'ongoing'};
}
export function beginTurn(state:TacticalCombatState):TacticalCombatState{
  const nextTurn=state.turn+1;
  const boss=state.boss?nextBossTurn(state.boss,state.enemyHp,state.enemyMaxHp):undefined;
  return {...state,turn:nextTurn,cooldowns:tickCooldowns(state.cooldowns),statuses:tickStatuses(state.statuses),boss};
}
