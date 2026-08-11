'use client';
import { useMemo } from 'react';
import { buildRoomTilemap, type TileCell } from '../../lib/rpg/tilemap-engine';
import type { DungeonRoom } from '../../lib/rpg/dungeon-engine';
import { AssetSprite } from './AssetSprite';

export function TilemapRenderer({room}:{room:DungeonRoom}){
 const map=useMemo(()=>buildRoomTilemap(room),[room]);
 return <div className="tilemap-scene" role="img" aria-label={`Dungeon room ${room.id}`} style={{display:'grid',gridTemplateColumns:`repeat(${map.width}, var(--tile-size, 32px))`,gridAutoRows:'var(--tile-size, 32px)',width:`calc(${map.width} * var(--tile-size, 32px))`}}>{map.layers.flatMap(layer=>layer.cells).map((cell:TileCell)=><div key={`${cell.x}-${cell.y}`} className={`tile-cell tile-${cell.tile} ${cell.blocked?'blocked':'walkable'}`} data-x={cell.x} data-y={cell.y}><AssetSprite id={cell.assetId} alt="" className="tile-sprite" /></div>)}</div>;
}
