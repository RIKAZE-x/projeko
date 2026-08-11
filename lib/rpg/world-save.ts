import type { WorldSimulation } from './simulation-runtime';

const PREFIX='veilbound.world.';
export interface WorldSave { version:1; savedAt:string; simulation:WorldSimulation; }

export function saveWorld(slot:number, simulation:WorldSimulation){
 if(typeof window==='undefined')return;
 const payload:WorldSave={version:1,savedAt:new Date().toISOString(),simulation};
 localStorage.setItem(`${PREFIX}${slot}`,JSON.stringify(payload));
}

export function loadWorld(slot:number):WorldSimulation|null{
 if(typeof window==='undefined')return null;
 const raw=localStorage.getItem(`${PREFIX}${slot}`); if(!raw)return null;
 try{const payload=JSON.parse(raw) as WorldSave; return payload.version===1?payload.simulation:null;}catch{return null;}
}

export function clearWorld(slot:number){if(typeof window!=='undefined')localStorage.removeItem(`${PREFIX}${slot}`);}
