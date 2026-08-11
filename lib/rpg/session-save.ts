import type { GameState } from './types';
import { normalizeLoadedSlice, type VerticalSliceState } from './vertical-slice';

const KEY='veilbound.session.v1';

export function saveSession(state:GameState,dungeonSeed:number,roomIndex:number){
 if(typeof window==='undefined') return;
 const payload:VerticalSliceState={version:1,state,dungeonSeed,roomIndex};
 localStorage.setItem(KEY,JSON.stringify(payload));
}

export function loadSession():VerticalSliceState|null{
 if(typeof window==='undefined') return null;
 try{return normalizeLoadedSlice(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{return null;}
}

export function clearSession(){if(typeof window!=='undefined')localStorage.removeItem(KEY);}
