import type { MarketState, EconomyEvent } from './economy-engine';
import { applyEconomyEvent } from './economy-engine';
import type { QuestState } from './quest-engine';
import type { FactionState } from './faction-engine';

export interface WorldEvent { id:string; title:string; description:string; economyEvent?:EconomyEvent; factionId?:string; reputationDelta?:number; unlockFlags?:string[]; }
export interface WorldEventState { events:WorldEvent[]; flags:string[]; market:MarketState; quests:QuestState[]; factions:FactionState[]; }

export function resolveWorldEvent(state:WorldEventState,eventId:string):WorldEventState{
 const event=state.events.find(e=>e.id===eventId); if(!event)return state;
 let market=state.market; if(event.economyEvent) market=applyEconomyEvent(market,event.economyEvent);
 const factions=event.factionId?state.factions.map(f=>f.id===event.factionId?{...f,reputation:f.reputation+(event.reputationDelta??0)}:f):state.factions;
 return {...state,market,factions,flags:[...new Set([...state.flags,...(event.unlockFlags??[])])]};
}

export const INITIAL_WORLD_EVENTS:WorldEvent[]=[
 {id:'ashen-bell-rung',title:'The Ashen Bell Rings',description:'A forbidden bell changes monster migration patterns.',economyEvent:{type:'monster-migration',intensity:1},factionId:'ember-guild',reputationDelta:4,unlockFlags:['ashen-bell-active']},
 {id:'iron-road-ambush',title:'Iron Road Ambush',description:'Trade caravans stop reaching Valeria.',economyEvent:{type:'route-disrupted',intensity:1.2},factionId:'merchant-league',reputationDelta:-6,unlockFlags:['iron-road-disrupted']},
 {id:'dungeon-boom',title:'Dungeon Boom',description:'A new dungeon floods the market with monster cores.',economyEvent:{type:'dungeon-discovered',intensity:2},unlockFlags:['new-dungeon-open']},
];
