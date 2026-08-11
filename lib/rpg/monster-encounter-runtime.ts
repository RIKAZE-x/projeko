import type { GameState } from './types';
import type { MonsterPlacement } from './monster-aggro';

export interface EncounterMonster extends MonsterPlacement { name:string; level:number; hp:number; maxHp:number; attack:number; defense:number; traits:string[]; }
export interface EncounterRuntime { active:boolean; monsterId?:string; monster?:EncounterMonster; startedAt?:number; }

export function toEncounterMonster(monster:MonsterPlacement, playerLevel:number):EncounterMonster {
 const level=Math.max(1,playerLevel+(monster.kind==='boss'?4:monster.kind==='elite'?2:1));
 const hp=40+level*10;
 return {...monster,name:monster.kind,level,hp,maxHp:hp,attack:8+level*2,defense:4+level,traits:[monster.assetId]};
}

export function engageMonster(monster:EncounterMonster):EncounterRuntime { return monster.engaged ? {active:true,monsterId:monster.id,monster,startedAt:Date.now()} : {active:false}; }

export function applyEncounterToGame(game:GameState, monster:EncounterMonster):GameState {
 return {...game,activeMonster:{...game.activeMonster,id:monster.id,name:monster.name,level:monster.level,hp:monster.hp,maxHp:monster.maxHp,attack:monster.attack,defense:monster.defense,traits:monster.traits}};
}

export function finishEncounter(game:GameState, monsterId:string, victory:boolean):GameState {
 const logs=[victory?`Defeated ${monsterId}.`:`Escaped from ${monsterId}.`,...game.logs].slice(0,50);
 return {...game,logs,activeMonster:victory?undefined:game.activeMonster};
}
