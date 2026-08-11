import type { DungeonRoom, Dungeon } from './dungeon-engine';
import type { AssetDefinition } from './asset-registry';

export interface TileCell { x:number; y:number; tile:'floor'|'wall'|'door'|'void'; assetId:string; blocked:boolean; }
export interface TilemapLayer { id:string; z:number; cells:TileCell[]; }
export interface DungeonTilemap { width:number; height:number; layers:TilemapLayer[]; anchor:{x:number;y:number}; }

export function buildRoomTilemap(room:DungeonRoom, width=12, height=8):DungeonTilemap {
  const cells:TileCell[]=[];
  for(let y=0;y<height;y++) for(let x=0;x<width;x++){
    const edge=x===0||y===0||x===width-1||y===height-1;
    const door=(x===Math.floor(width/2)&&y===0)||(x===Math.floor(width/2)&&y===height-1);
    cells.push({x,y,tile:edge?(door?'door':'wall'):'floor',assetId:edge?(door?'prop.door.basic':'tile.dungeon.wall'):'tile.dungeon.floor',blocked:edge&&!door});
  }
  return {width,height,layers:[{id:'base',z:0,cells}],anchor:{x:Math.floor(width/2),y:Math.floor(height/2)}};
}

export function roomAccent(room:DungeonRoom):string {
  switch(room.kind){case 'Boss':return 'monster.boss';case 'Elite':return 'monster.elite';case 'Treasure':return 'prop.chest.iron';case 'Shrine':return 'prop.shrine.basic';default:return 'monster.slime.verdant';}
}

export function dungeonTilemaps(dungeon:Dungeon):Record<string,DungeonTilemap>{return Object.fromEntries(dungeon.rooms.map(room=>[room.id,buildRoomTilemap(room)]));}

export function hasAsset(defs:AssetDefinition[],id:string):boolean{return defs.some(def=>def.id===id);}
