import type { AutosaveCheckpoint } from './autosave';
const PREFIX='veilbound.autosave.';
export function saveCheckpoint(slot:number,checkpoint:AutosaveCheckpoint){if(typeof window==='undefined')return;localStorage.setItem(`${PREFIX}${slot}`,JSON.stringify(checkpoint));}
export function loadCheckpoint(slot:number):AutosaveCheckpoint|null{if(typeof window==='undefined')return null;const raw=localStorage.getItem(`${PREFIX}${slot}`);if(!raw)return null;try{return JSON.parse(raw) as AutosaveCheckpoint;}catch{return null;}}
export function clearCheckpoint(slot:number){if(typeof window!=='undefined')localStorage.removeItem(`${PREFIX}${slot}`);}
