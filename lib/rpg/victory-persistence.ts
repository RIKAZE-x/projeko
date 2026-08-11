import type { GameState } from './types';
import type { SocialState } from './social-runtime';

export interface VictoryReward { xp:number; gold:number; lootIds:string[]; }
export interface VictoryRecord { roomId:string; monsterId:string; reward:VictoryReward; defeatedAt:string; }

export interface VictoryState { records:Record<string,VictoryRecord>; }

export function createVictoryState():VictoryState{return {records:{}};}

export function victoryKey(roomId:string,monsterId:string){return `${roomId}:${monsterId}`;}

export function applyVictory(state:VictoryState, game:GameState, roomId:string, monsterId:string, reward:VictoryReward):{state:VictoryState;game:GameState;social:SocialState|null;alreadyCleared:boolean}{
 const key=victoryKey(roomId,monsterId);
 if(state.records[key]) return {state,game,social:null,alreadyCleared:true};
 const nextGame={...game,character:{...game.character,xp:(game.character.xp??0)+reward.xp,gold:game.character.gold+reward.gold},logs:[`Defeated ${monsterId}. +${reward.xp} XP +${reward.gold} gold.`,...game.logs].slice(0,50)};
 return {state:{records:{...state.records,[key]:{roomId,monsterId,reward,defeatedAt:new Date().toISOString()}}},game:nextGame,social:null,alreadyCleared:false};
}

export function isCleared(state:VictoryState,roomId:string,monsterId:string){return Boolean(state.records[victoryKey(roomId,monsterId)]);}
