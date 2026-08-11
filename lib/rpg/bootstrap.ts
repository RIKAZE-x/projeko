import type { GameState } from './types';
import { aren, monsters } from './content';

export interface SaveSummary { version:1; slot:number; savedAt:string; character:string; level:number; location:string; }

export function createNewGameState():GameState{
  return {
    day:1,
    hour:8,
    location:'Valeria — Crossroads',
    character:structuredClone(aren),
    party:[],
    activeMonster:structuredClone(monsters[0]),
    economy:{inflation:0,trust:100,prices:{iron:14,mithril:240,manaCrystal:90},treasuryReserves:{gold:1000000,mana:100000}},
    logs:['The Veil is quiet. Your story begins at the Crossroads.'],
  };
}

export function summarizeSave(slot:number,state:GameState):SaveSummary{
  return {version:1,slot,savedAt:new Date().toISOString(),character:state.character.name,level:state.character.level,location:state.location};
}
