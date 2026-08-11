import type { MonsterPlacement } from './monster-aggro';
export function encounterFromAggro(monsters:MonsterPlacement[]):MonsterPlacement|undefined{return monsters.find(m=>m.engaged);}
