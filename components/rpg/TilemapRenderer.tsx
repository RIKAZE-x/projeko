'use client';
import { useMemo } from 'react';
import { tilemapForDungeon, type TileCell } from '../../lib/rpg/tilemap-engine';
import { AssetSprite } from './AssetSprite';

export function TilemapRenderer({seed,roomIndex}:{seed:number;roomIndex:number}){
 const map=useMemo(()=>tilemapForDungeon(seed,roomIndex),[seed,roomIndex]);
 return <div className="tilemap-scene" role="img" aria-label={`Dungeon room ${roomIndex+1}`} style={{gridTemplateColumns:`repeat(${map.width}, var(--tile-size, 32px)`}}>{map.cells.map((cell:TileCell)=>{const logical=cell.assetId;const classes=['tile-cell',`tile-${cell.kind}`,cell.blocked?'blocked':'walkable'];return <div key={`${cell.x}-${cell.y}`} className={classes.join(' ')} data-x={cell.x} data-y={cell.y}><AssetSprite id={logical} alt="" className="tile-sprite" /></div>})}</div>;
}
