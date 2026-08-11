import type { GameState } from './types';
export function storeTravelState(state:GameState){if(typeof window!=='undefined')sessionStorage.setItem('veilbound.pendingState',JSON.stringify(state));}
export function loadTravelState(){if(typeof window==='undefined')return null;try{const raw=sessionStorage.getItem('veilbound.pendingState');if(!raw)return null;sessionStorage.removeItem('veilbound.pendingState');return JSON.parse(raw) as GameState;}catch{return null;}}
