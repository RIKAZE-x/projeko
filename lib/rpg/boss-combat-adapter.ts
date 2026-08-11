import type { GameState } from './types';
import type { BossCombatState } from './boss-combat-engine';
import type { GridPoint } from './boss-aoe';
import { beginBossTurn, resolveBossTurn } from './boss-turn-runtime';

export interface BossCombatAdapterState { boss:BossCombatState; player:GridPoint; origin:GridPoint; }

export function prepareBossTurn(state:BossCombatAdapterState,hp:number,maxHp:number):BossCombatAdapterState {
  return {...state,boss:beginBossTurn(state.boss,hp,maxHp)};
}

export function resolveBossAttack(state:BossCombatAdapterState):BossCombatAdapterState & {result:{hit:boolean;damage:number;status?:'burn'|'bleed'|'stun'}} {
  const result=resolveBossTurn(state.boss,state.player,state.origin);
  return {...state,boss:result.state,result:{hit:result.hit,damage:result.damage,status:result.status}};
}

export function applyBossResult(game:GameState,result:{hit:boolean;damage:number;status?:'burn'|'bleed'|'stun'}):GameState {
  if(!result.hit||result.damage<=0) return game;
  const character={...game.character,hp:Math.max(0,game.character.hp-result.damage)};
  return {...game,character,logs:[`Boss attack hit for ${result.damage}.${result.status?` Status: ${result.status}.`:''}`,...game.logs].slice(0,50)};
}
