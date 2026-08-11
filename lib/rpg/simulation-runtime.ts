import type { GameState } from './types';
import { applyEconomyEvent, recalculatePrices, type EconomyEvent, type MarketState } from './economy-engine';

export interface FactionRuntime { id:string; name:string; reputation:number; standing:'hostile'|'unfriendly'|'neutral'|'friendly'|'allied'; favors:number; flags:string[]; }
export interface QuestRuntime { id:string; title:string; active:boolean; completed:boolean; failed:boolean; flags:string[]; }
export interface WorldSimulation { game:GameState; factions:FactionRuntime[]; quests:QuestRuntime[]; market:MarketState; flags:Record<string,boolean>; travelRisk:number; events:string[]; }

export function factionStanding(reputation:number):FactionRuntime['standing']{if(reputation>=80)return'allied';if(reputation>=40)return'friendly';if(reputation>=-10)return'neutral';if(reputation>=-50)return'unfriendly';return'hostile';}

export function createSimulation(game:GameState):WorldSimulation {
 const market:MarketState={prices:{...game.economy.prices},supply:{iron:500,mithril:80,food:1000,manaCrystal:300,'monster-core':120},demand:{iron:450,mithril:90,food:850,manaCrystal:260,'monster-core':100},inflation:game.economy.inflation/100,treasury:game.economy.treasuryReserves.gold,taxRate:.02};
 return {game,factions:[{id:'guild',name:'Adventurer Guild',reputation:20,standing:'neutral',favors:0,flags:[]},{id:'valeria',name:'Valeria Crown',reputation:5,standing:'neutral',favors:0,flags:[]}],quests:[{id:'ashen-bell',title:'The Ashen Bell',active:true,completed:false,failed:false,flags:[]},{id:'wolves-greyfen',title:'Wolves of Greyfen',active:false,completed:false,failed:false,flags:[]}],market,flags:{},travelRisk:.15,events:['World simulation initialized.']};
}

export function applyWorldEvent(sim:WorldSimulation,event:EconomyEvent, factionId?:string, reputationDelta=0, flag?:string):WorldSimulation {
 const market=recalculatePrices(applyEconomyEvent(sim.market,event));
 const factions=sim.factions.map(f=>f.id!==factionId?f:{...f,reputation:Math.max(-100,Math.min(100,f.reputation+reputationDelta)),standing:factionStanding(Math.max(-100,Math.min(100,f.reputation+reputationDelta))),favors:Math.max(0,f.favors+(reputationDelta>=20?1:0)),flags:flag&&!f.flags.includes(flag)?[...f.flags,flag]:f.flags});
 const hostile=factions.filter(f=>f.standing==='hostile').length; const allied=factions.filter(f=>f.standing==='allied').length;
 return {...sim,market, factions, travelRisk:Math.max(.1,sim.travelRisk+hostile*.04-allied*.02),flags:flag?{...sim.flags,[flag]:true}:sim.flags,events:[`${event.type} x${event.intensity}${flag?` → ${flag}`:''}`,...sim.events].slice(0,30)};
}

export function chooseAshenBell(sim:WorldSimulation, choice:'investigate'|'warn-guild'|'ring-back') {
 if(choice==='investigate') return applyWorldEvent({...sim,quests:sim.quests.map(q=>q.id==='ashen-bell'?{...q,active:false,completed:true}:q)}, {type:'dungeon-discovered',intensity:1}, undefined, 0, 'ash-chamber');
 if(choice==='warn-guild') return applyWorldEvent({...sim,quests:sim.quests.map(q=>q.id==='ashen-bell'?{...q,active:false}:q)}, {type:'monster-migration',intensity:1}, 'guild', 8, 'guild-mobilization');
 return applyWorldEvent({...sim,quests:sim.quests.map(q=>q.id==='ashen-bell'?{...q,active:false}:q)}, {type:'world-core-drain',intensity:1}, undefined, 0, 'veil-response');
}
