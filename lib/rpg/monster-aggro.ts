export type AggroState='idle'|'alert'|'chasing';
export interface MonsterPlacement {id:string;kind:string;assetId:string;x:number;y:number;radius:number;state:AggroState;engaged:boolean;}
export function placeMonsters(roomKind:string,seed:number,width=12,height=8):MonsterPlacement[]{
 const count=roomKind==='Boss'?1:roomKind==='Elite'?2:roomKind==='Combat'?1:0;
 const result:MonsterPlacement[]=[];
 for(let i=0;i<count;i++){
  const x=2+((seed+i*7)%Math.max(1,width-4)); const y=2+((Math.floor(seed/7)+i*3)%Math.max(1,height-4));
  result.push({id:`monster-${i}`,kind:roomKind==='Boss'?'boss':roomKind==='Elite'?'elite':'verdant-slime',assetId:'monster.slime.verdant',x,y,radius:roomKind==='Boss'?4:roomKind==='Elite'?3:2,state:'idle',engaged:false});
 }
 return result;
}
export function updateAggro(monsters:MonsterPlacement[],player:{x:number;y:number}):MonsterPlacement[]{
 return monsters.map(m=>{const d=Math.abs(m.x-player.x)+Math.abs(m.y-player.y);const state=d<=m.radius?(d<=1?'chasing':'alert'):'idle';return {...m,state,engaged:m.engaged||d<=1};});
}
