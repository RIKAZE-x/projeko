'use client';
import { useMemo } from 'react';
import { roomObjects } from '../../lib/rpg/dungeon-interaction';
import { AssetSprite } from './AssetSprite';
import type { DungeonRoom } from '../../lib/rpg/dungeon-engine';

export function DungeonInteractions({room,onInteract}:{room:DungeonRoom;onInteract:(id:string)=>void}){
 const objects=useMemo(()=>roomObjects(room),[room]);
 return <>{objects.map(object=><button key={object.id} className="dungeon-object" style={{left:`${object.x*32}px`,top:`${object.y*32}px`}} aria-label={object.label} onClick={()=>onInteract(object.id)}><AssetSprite id={object.assetId} alt="" className="object-sprite"/></button>)}</>;
}
