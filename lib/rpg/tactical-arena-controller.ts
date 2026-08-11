import type { GameState } from './types';
import type { BossCombatState } from './boss-combat-engine';
import type { BossTurnResult } from './boss-turn-runtime';
import { beginBossTurn, resolveBossTurn } from './boss-turn-runtime';
import { runTacticalAction, type TacticalActionResult } from './tactical-action-pipeline';

export interface ArenaState {
  turn:number;
  playerHp:number;
  playerMaxHp:number;
  enemyHp:number;
  enemyMaxHp:number;
  boss?:BossCombatState;
  cooldowns:Record<string,number>;
  statuses:Record<string,number>;
  outcome:'active'|'victory'|'defeat';
  log:string[];
}

export function createArenaState(playerHp:number,enemyHp:number,boss?:BossCombatState):ArenaState{return {turn:1,playerHp,playerMaxHp:playerHp,enemyHp,enemyMaxHp:enemyHp,boss,cooldowns:{},statuses:{},outcome:'active',log:[]};}

export function startBossTelegraph(state:ArenaState):ArenaState { if(!state.boss||state.outcome!=='active') return state; return {...state,boss:beginBossTurn(state.boss,state.enemyHp,state.enemyMaxHp)}; }

export function resolvePlayerAction(state:ArenaState,action:Parameters<typeof runTacticalAction>[1],game:GameState):{state:ArenaState;action:TacticalActionResult;game:GameState}{
 if(state.outcome!=='active') return {state,action:{ok:false,reason:'combat-finished'},game};
 const result=runTacticalAction(game,action);
 const next={...state,turn:state.turn+1,playerHp:result.game.character.hp??state.playerHp,enemyHp:result.game.activeMonster?.hp??0,cooldowns:result.cooldowns,statuses:result.statuses,log:[result.message,...state.log].slice(0,30)};
 const outcome=next.enemyHp<=0?'victory':next.playerHp<=0?'defeat':'active';
 return {state:{...next,outcome},action:result,game:result.game};
}

export function resolveBossResponse(state:ArenaState,player:{x:number;y:number},origin:{x:number;y:number}):{state:ArenaState;result:BossTurnResult}{
 if(!state.boss||state.outcome!=='active') return {state,result:{state:state.boss??{phase:1,turn:state.turn,enrage:false},hit:false,damage:0}};
 const result=resolveBossTurn(state.boss,player,origin);
 const nextPlayerHp=Math.max(0,state.playerHp-result.damage);
 return {state:{...state,playerHp:nextPlayerHp,boss:result.state,outcome:nextPlayerHp<=0?'defeat':'active',log:[result.hit?`Boss hit for ${result.damage}.`:'Dodged boss attack.',...state.log].slice(0,30)},result};
}

export function tickArena(state:ArenaState):ArenaState{
 const cooldowns=Object.fromEntries(Object.entries(state.cooldowns).map(([k,v])=>[k,Math.max(0,v-1)]));
 const statuses=Object.fromEntries(Object.entries(state.statuses).map(([k,v])=>[k,Math.max(0,v-1)]).filter(([,v])=>v>0));
 return {...state,cooldowns,statuses};
}
