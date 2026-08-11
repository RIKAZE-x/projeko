import type { Character, GameState, Monster, Skill } from './types';
import { applyStatus, statusDamage, tickStatuses, type StatusEffect } from './status-engine';
import { generateLoot } from './loot-engine';

export type CombatAction='attack'|'skill'|'guard'|'flee';
export interface CombatState { playerHp:number; playerMana:number; enemyHp:number; enemyMaxHp:number; enemyStatuses:StatusEffect[]; playerStatuses:StatusEffect[]; guarding:boolean; victory:boolean; defeat:boolean; escaped:boolean; turns:number; log:string[]; }
export interface CombatResult { state:CombatState; game:GameState; lootId?:string; xpGained:number; goldGained:number; }

export function startCombat(game:GameState):CombatState { const e=game.activeMonster; return {playerHp:100,playerMana:100,enemyHp:e.hp,enemyMaxHp:e.maxHp,enemyStatuses:[],playerStatuses:[],guarding:false,victory:false,defeat:false,escaped:false,turns:0,log:[`${e.name} enters combat.`]}; }

function playerPower(c:Character){return c.attributes.STR + Math.floor(c.attributes.SPD/2) + Math.floor(c.attributes.SKL/2);}
function skillPower(c:Character,s?:Skill){return playerPower(c)+(s?.tier??1)*6+(s?.level??1)*2;}
function enemyPower(e:Monster){return e.attributes.STR + Math.floor(e.attributes.SPD/2);}

export function resolveCombatAction(game:GameState, combat:CombatState, action:CombatAction, skill?:Skill):CombatResult {
 if(combat.victory||combat.defeat||combat.escaped) return {state:combat,game,xpGained:0,goldGained:0};
 const next:CombatState={...combat,enemyStatuses:[...combat.enemyStatuses],playerStatuses:[...combat.playerStatuses],log:[...combat.log],turns:combat.turns+1};
 const enemy=game.activeMonster; let playerDamage=0; let manaCost=0;
 if(action==='flee'){next.escaped=Math.random()<0.55;next.log.unshift(next.escaped?'You escaped the encounter.':'The escape attempt failed.');}
 else if(action==='guard'){next.guarding=true;next.log.unshift('You brace for the next hit.');}
 else if(action==='attack'){playerDamage=Math.max(1,playerPower(game.character)-Math.floor(enemy.attributes.RES/4));next.log.unshift(`Attack deals ${playerDamage} damage.`);}
 else if(action==='skill'){manaCost=Math.max(1,skill?.manaCost??18);if(next.playerMana<manaCost){next.log.unshift('Not enough mana.');return {state:combat,game,xpGained:0,goldGained:0};}next.playerMana-=manaCost;playerDamage=Math.max(2,skillPower(game.character,skill)-Math.floor(enemy.attributes.RES/5));next.enemyStatuses=applyStatus(next.enemyStatuses,{id:'Burn',duration:2,stacks:1,power:Math.max(1,Math.floor(playerDamage/10)),source:skill?.name??'skill'});next.log.unshift(`${skill?.name??'Skill'} deals ${playerDamage} damage and applies Burn.`);}
 next.enemyHp=Math.max(0,next.enemyHp-playerDamage);
 const dot=next.enemyStatuses.reduce((sum,s)=>sum+statusDamage(s),0); if(dot){next.enemyHp=Math.max(0,next.enemyHp-dot);next.log.unshift(`Status effects deal ${dot} damage.`);}
 next.enemyStatuses=tickStatuses(next.enemyStatuses);
 if(next.enemyHp<=0){next.victory=true;const xp=enemy.rewardXp;const gold=enemy.rewardGold;const material=game.character.equipment[0]?.material??{id:'iron',name:'Iron',hardness:10,durability:20,manaConductivity:5,weight:1};const item=generateLoot(Date.now(),game.character.level,material,'Reward Weapon');const updated={...game,character:{...game.character,xp:game.character.xp+xp,gold:game.character.gold+gold,role:{...game.character.role,counters:{...game.character.role.counters,combatCleared:(game.character.role.counters.combatCleared??0)+1}}},logs:[`${enemy.name} defeated. +${xp} XP, +${gold} gold, loot recovered.`,...game.logs].slice(0,20)};return {state:next,game:updated,lootId:item.id,xpGained:xp,goldGained:gold};}
 const incoming=Math.max(1,enemyPower(enemy)-Math.floor(game.character.attributes.VIT/5));const reduced=next.guarding?Math.floor(incoming/2):incoming;next.playerHp=Math.max(0,next.playerHp-reduced);next.guarding=false;next.playerStatuses=applyStatus(next.playerStatuses,{id:'Bleed',duration:2,stacks:1,power:Math.max(1,Math.floor(reduced/12)),source:enemy.name});const pDot=next.playerStatuses.reduce((sum,s)=>sum+statusDamage(s),0);next.playerHp=Math.max(0,next.playerHp-pDot);next.playerStatuses=tickStatuses(next.playerStatuses);next.log.unshift(`${enemy.name} retaliates for ${reduced} damage${pDot?` plus ${pDot} status damage`:''}.`);if(next.playerHp<=0)next.defeat=true;return {state:next,game,xpGained:0,goldGained:0};
}
