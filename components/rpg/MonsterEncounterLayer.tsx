'use client';
import { useEffect, useMemo, useState } from 'react';
import { AssetSprite } from './AssetSprite';
import { placeMonsters, updateAggro, type MonsterPlacement } from '../../lib/rpg/monster-aggro';
import type { GameState } from '../../lib/rpg/types';
import { applyEncounterToGame, engageMonster, toEncounterMonster, type EncounterRuntime } from '../../lib/rpg/monster-encounter-runtime';

interface Props { roomKind:string; seed:number; player:{x:number;y:number}; onEncounter:(game:GameState, encounter:EncounterRuntime)=>void; game:GameState; }
export function MonsterEncounterLayer({roomKind,seed,player,onEncounter,game}:Props){
 const initial=useMemo(()=>placeMonsters(roomKind,seed),[roomKind,seed]);
 const [actors,setActors]=useState<MonsterPlacement[]>(initial);
 useEffect(()=>setActors(updateAggro(initial,player)),[initial,player.x,player.y]);
 useEffect(()=>{const engaged=updateAggro(actors,player).find(m=>m.engaged);if(!engaged)return;const monster=toEncounterMonster(engaged,game.character.level);const encounter=engageMonster(monster);if(encounter.active)onEncounter(applyEncounterToGame(game,monster),encounter);},[player.x,player.y,actors,game,onEncounter]);
 return <>{actors.map(m=><div key={m.id} className={`monster-actor ${m.state}`} style={{left:`${m.x*32}px`,top:`${m.y*32}px`}}><AssetSprite id={m.assetId} alt={m.kind} className="monster-sprite"/></div>)}</>;
}
