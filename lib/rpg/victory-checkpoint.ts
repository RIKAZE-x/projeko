import type { GameState } from './types';
import type { SocialState } from './social-runtime';
import { createCheckpoint, type AutosaveCheckpoint } from './autosave';
import type { VictoryState } from './victory-persistence';

export function victoryCheckpoint(slot:number,game:GameState,social:SocialState,session:{dungeonSeed:number;roomIndex:number},victory:VictoryState):AutosaveCheckpoint {
 const checkpoint=createCheckpoint('combat-victory',slot,game,social,session.dungeonSeed,session.roomIndex);
 return {...checkpoint,profile:{...checkpoint.profile,game,social,session:{...session},meta:{...checkpoint.profile.meta}}};
}

export function serializeVictoryState(state:VictoryState){return JSON.stringify({version:1,state});}
export function deserializeVictoryState(input:unknown):VictoryState|null{if(!input||typeof input!=='object')return null;const x=input as {version?:number;state?:VictoryState};return x.version===1&&x.state?x.state:null;}
