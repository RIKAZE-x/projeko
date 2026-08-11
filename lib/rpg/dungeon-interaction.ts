import type { DungeonRoom } from './dungeon-engine';

export type InteractionKind='chest'|'shrine'|'trap'|'loot'|'encounter';
export interface DungeonObject { id:string; kind:InteractionKind; x:number; y:number; assetId:string; once:boolean; label:string; }
export interface InteractionResult { ok:boolean; message:string; checkpoint:'dungeon-room'|'combat-victory'|'quest-choice'; goldDelta:number; xpDelta:number; }

export function roomObjects(room:DungeonRoom):DungeonObject[]{
 const kind=room.kind;
 const objects:DungeonObject[]=[];
 if(kind==='Treasure') objects.push({id:`${room.id}:chest`,kind:'chest',x:3,y:3,assetId:'prop.chest.iron',once:true,label:'Ironbound Chest'});
 if(kind==='Shrine') objects.push({id:`${room.id}:shrine`,kind:'shrine',x:8,y:3,assetId:'prop.shrine.basic',once:true,label:'Veiled Shrine'});
 if(kind==='Combat'||kind==='Elite'||kind==='Boss') objects.push({id:`${room.id}:encounter`,kind:'encounter',x:6,y:4,assetId:'monster.slime.verdant',once:false,label:`${kind} Encounter`});
 if(room.danger>=4) objects.push({id:`${room.id}:trap`,kind:'trap',x:5,y:5,assetId:'prop.trap.basic',once:true,label:'Hidden Trap'});
 return objects;
}

export function resolveInteraction(object:DungeonObject):InteractionResult{
 switch(object.kind){
  case 'chest': return {ok:true,message:'Chest opened. Salvage secured.',checkpoint:'dungeon-room',goldDelta:25,xpDelta:10};
  case 'shrine': return {ok:true,message:'The shrine answers with a faint resonance.',checkpoint:'quest-choice',goldDelta:0,xpDelta:15};
  case 'trap': return {ok:true,message:'A trap triggers beneath your feet.',checkpoint:'dungeon-room',goldDelta:0,xpDelta:0};
  case 'loot': return {ok:true,message:'Loot collected.',checkpoint:'dungeon-room',goldDelta:10,xpDelta:5};
  case 'encounter': return {ok:true,message:'Hostile presence engaged.',checkpoint:'combat-victory',goldDelta:0,xpDelta:0};
 }
}
