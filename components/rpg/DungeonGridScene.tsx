'use client';
import { useMemo, useState } from 'react';
import { buildRoomTilemap } from '../../lib/rpg/tilemap-engine';
import { movePlayer, startPosition, type Direction, type GridPosition } from '../../lib/rpg/player-movement';
import { AssetSprite } from './AssetSprite';
import { GridPlayer } from './GridPlayer';
import type { DungeonRoom } from '../../lib/rpg/dungeon-engine';

export function DungeonGridScene({room,onRoomChange}:{room:DungeonRoom;onRoomChange:(delta:number)=>void}){
 const map=useMemo(()=>buildRoomTilemap(room),[room]);
 const [position,setPosition]=useState<GridPosition>(()=>startPosition(map));
 const [notice,setNotice]=useState('');
 const onMove=(direction:Direction)=>{
  const result=movePlayer(map,position,direction);
  if(result.door&&result.nextRoomDelta){setNotice(result.nextRoomDelta<0?'Upper door':'Lower door');onRoomChange(result.nextRoomDelta);return;}
  if(result.blocked){setNotice('Blocked');return;}
  setNotice('');setPosition(result.position);
 };
 return <div className="dungeon-grid-wrap"><div className="dungeon-grid" style={{'--tile-size':'32px',display:'grid',gridTemplateColumns:`repeat(${map.width}, 32px)`,gridTemplateRows:`repeat(${map.height}, 32px)`,position:'relative',width:`${map.width*32}px`,height:`${map.height*32}px`} as React.CSSProperties}>
  {map.layers[0].cells.map(cell=><div key={`${cell.x}-${cell.y}`} className={`tile-cell tile-${cell.tile} ${cell.blocked?'blocked':'walkable'}`} style={{width:32,height:32}}><AssetSprite id={cell.assetId} alt="" className="tile-sprite"/></div>)}
  <GridPlayer position={position} onMove={onMove}/>
 </div>{notice&&<div className="movement-notice">{notice}</div>}<p className="movement-help">WASD / Arrow Keys · Move on grid · Doors change room</p></div>;
}
