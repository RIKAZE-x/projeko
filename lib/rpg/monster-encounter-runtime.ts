import type { GameState } from './types';
import type { MonsterActor } from './monster-aggro';

export interface EncounterRuntime { active:boolean; monsterId?:string; monster?:MonsterActor; startedAt?:number; }

export function engageMonster(monster:MonsterActor):EncounterRuntime {
 return monster.engaged ? {active:true,monsterId:monster.id,monster,startedAt:Date.now()} : {active:false};
}

export function applyEncounterToGame(game:GameState, monster:MonsterActor):GameState {
 return {...game,activeMonster:{...game.activeMonster,id:monster.id,name:monster.name,level:monster.level,hp:monster.hp,maxHp:monster.maxHp,attack:monster.attack,defense:monster.defense,traits:[monster.assetId]}};
}

export function finishEncounter(game:GameState, monsterId:string, victory:boolean):GameState {
 const logs=[victory?`Defeated ${monsterId}.`:`Escaped from ${monsterId}.`,...game.logs].slice(0,50);
 return {...game,logs,activeMonster:victory?undefined:game.activeMonster};
}
