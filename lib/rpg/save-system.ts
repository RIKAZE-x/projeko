import type { GameState } from './types';
const PREFIX='veilbound.save.';
export interface SaveSlot{version:1;updatedAt:string;state:GameState;}
export function saveSlot(slot:number,state:GameState){if(typeof window==='undefined')return;const payload:SaveSlot={version:1,updatedAt:new Date().toISOString(),state};localStorage.setItem(`${PREFIX}${slot}`,JSON.stringify(payload));}
export function loadSlot(slot:number):GameState|null{if(typeof window==='undefined')return null;const raw=localStorage.getItem(`${PREFIX}${slot}`);if(!raw)return null;try{const payload=JSON.parse(raw) as SaveSlot;return payload.version===1?payload.state:null;}catch{return null;}}
export function deleteSlot(slot:number){if(typeof window!=='undefined')localStorage.removeItem(`${PREFIX}${slot}`);}
