import type { RoomClearState } from './room-clears';
import { clearMonster, createRoomClearState } from './room-clears';

export interface DungeonSessionRuntime {
  seed:number;
  roomIndex:number;
  clears:RoomClearState;
}

export function createDungeonSession(seed:number,roomIndex=0):DungeonSessionRuntime{
  return {seed,roomIndex,clears:createRoomClearState(String(seed))};
}

export function hydrateDungeonSession(seed:number,roomIndex:number,clears?:RoomClearState|null):DungeonSessionRuntime{
  return {seed,roomIndex,clears:clears??createRoomClearState(String(seed))};
}

export function moveDungeonSession(session:DungeonSessionRuntime,roomIndex:number):DungeonSessionRuntime{
  return {...session,roomIndex};
}

export function markMonsterDefeated(session:DungeonSessionRuntime,roomId:string,monsterId:string):DungeonSessionRuntime{
  return {...session,clears:clearMonster(session.clears,roomId,monsterId)};
}
