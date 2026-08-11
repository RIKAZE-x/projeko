'use client';
import { useCallback, useState } from 'react';
import { createDungeonSession, hydrateDungeonSession, markMonsterDefeated, moveDungeonSession, type DungeonSessionRuntime } from '../../lib/rpg/dungeon-session';
import type { RoomClearState } from '../../lib/rpg/room-clears';

export function useDungeonSession(seed:number,roomIndex=0,initialClears?:RoomClearState|null){
 const [session,setSession]=useState<DungeonSessionRuntime>(()=>hydrateDungeonSession(seed,roomIndex,initialClears));
 const setRoom=useCallback((nextRoom:number)=>setSession(s=>moveDungeonSession(s,nextRoom)),[]);
 const clearMonster=useCallback((roomId:string,monsterId:string)=>setSession(s=>markMonsterDefeated(s,roomId,monsterId)),[]);
 const replace=useCallback((nextSeed:number,nextRoom:number,nextClears?:RoomClearState|null)=>setSession(hydrateDungeonSession(nextSeed,nextRoom,nextClears)),[]);
 return {session,setRoom,clearMonster,replace};
}

export { createDungeonSession };
