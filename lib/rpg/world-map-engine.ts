export type MapNodeKind='City'|'Village'|'Dungeon'|'Region'|'Crossroads';
export interface WorldMapNode{id:string;name:string;kind:MapNodeKind;region:string;danger:string;level:number;connected:string[];unlocked:boolean;}
export interface TravelPlan{from:string;to:string;distance:number;goldCost:number;risk:number;encounterChance:number;}

export const WORLD_MAP:WorldMapNode[]=[
{id:'valerion',name:'Valerion',kind:'City',region:'Central Heartland',danger:'E–C',level:1,connected:['crossroads','ironwall','emberfall'],unlocked:true},
{id:'crossroads',name:'Crossroads',kind:'Crossroads',region:'Central Heartland',danger:'E–B',level:5,connected:['valerion','goldmere','ashen-grotto'],unlocked:true},
{id:'ironwall',name:'Ironwall',kind:'City',region:'Dhurak Mountains',danger:'D–B',level:15,connected:['valerion','construct-ruins'],unlocked:true},
{id:'goldmere',name:'Goldmere',kind:'City',region:'Aelari Wilds',danger:'C–A',level:25,connected:['crossroads','aelari-wilds'],unlocked:true},
{id:'emberfall',name:'Emberfall',kind:'City',region:'Southern Wilds',danger:'D–A',level:10,connected:['valerion','ash-bell'],unlocked:true},
{id:'ash-bell',name:'Ashen Bell Dungeon',kind:'Dungeon',region:'Southern Wilds',danger:'C',level:18,connected:['emberfall'],unlocked:true},
{id:'ashen-grotto',name:'Ashen Grotto',kind:'Dungeon',region:'Central Heartland',danger:'C',level:20,connected:['crossroads'],unlocked:true},
{id:'construct-ruins',name:'Construct Ruins',kind:'Dungeon',region:'Construct Ruins',danger:'B',level:35,connected:['ironwall'],unlocked:true},
{id:'aelari-wilds',name:'Aelari Wilds',kind:'Region',region:'Aelari Wilds',danger:'B–S',level:40,connected:['goldmere'],unlocked:false},
];

export function getNode(id:string){return WORLD_MAP.find(n=>n.id===id);}
export function travelPlan(from:string,to:string,characterLevel:number):TravelPlan|null{
 const a=getNode(from),b=getNode(to); if(!a||!b||!a.connected.includes(b.id)||!b.unlocked)return null;
 const distance=Math.max(1,Math.abs(a.level-b.level)+5); const levelGap=Math.max(0,b.level-characterLevel); const risk=Math.min(0.95,0.05+levelGap*0.012+distance*0.006); return {from:a.id,to:b.id,distance,goldCost:Math.round(distance*3),risk,encounterChance:Math.min(0.8,risk*0.9+0.08)};
}

export function resolveTravel(plan:TravelPlan,seed:number){let x=(seed|0)>>>0;x=(x*1664525+1013904223)>>>0;const roll=x/4294967296;return {encounter:roll<plan.encounterChance,roll,destination:plan.to};}
