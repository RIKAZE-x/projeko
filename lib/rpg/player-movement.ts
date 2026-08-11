import type { TileCell, DungeonTilemap } from './tilemap-engine';

export type Direction='up'|'down'|'left'|'right';
export interface GridPosition{x:number;y:number;}
export interface MoveResult{position:GridPosition;moved:boolean;blocked:boolean;door?:boolean;nextRoomDelta?:number;}

export function startPosition(map:DungeonTilemap):GridPosition{return {x:map.anchor.x,y:map.anchor.y};}
export function findCell(map:DungeonTilemap,pos:GridPosition):TileCell|undefined{return map.layers.flatMap(l=>l.cells).find(c=>c.x===pos.x&&c.y===pos.y);}
export function movePlayer(map:DungeonTilemap,pos:GridPosition,direction:Direction):MoveResult{
 const delta:Record<Direction,GridPosition>={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
 const target={x:pos.x+delta[direction].x,y:pos.y+delta[direction].y};
 if(target.x<0||target.y<0||target.x>=map.width||target.y>=map.height)return {position:pos,moved:false,blocked:true};
 const cell=findCell(map,target);
 if(!cell)return {position:pos,moved:false,blocked:true};
 if(cell.tile==='door')return {position:target,moved:true,blocked:false,door:true,nextRoomDelta:direction==='up'?-1:direction==='down'?1:0};
 if(cell.blocked)return {position:pos,moved:false,blocked:true};
 return {position:target,moved:true,blocked:false};
}
