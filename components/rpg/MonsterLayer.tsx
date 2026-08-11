'use client';
import { useMemo } from 'react';
import { updateAggro, type MonsterPlacement } from '../../lib/rpg/monster-aggro';
import { AssetSprite } from './AssetSprite';
export function MonsterLayer({monsters,playerX,playerY}:{monsters:MonsterPlacement[];playerX:number;playerY:number}){
 const states=useMemo(()=>updateAggro(monsters,{x:playerX,y:playerY}),[monsters,playerX,playerY]);
 return <>{states.map(m=><div key={m.id} className="monster-token" style={{gridColumn:m.x+1,gridRow:m.y+1}} data-state={m.state}><AssetSprite id={m.assetId} alt={m.kind} className="monster-sprite"/><span>{m.state==='chasing'?'!':''}</span></div>)}</>;
}
