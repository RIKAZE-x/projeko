export interface RoomClearState { dungeonId:string; clearedByRoom:Record<string,string[]>; }

export function createRoomClearState(dungeonId:string):RoomClearState{return {dungeonId,clearedByRoom:{}};}

export function clearMonster(state:RoomClearState,roomId:string,monsterId:string):RoomClearState{
 const current=state.clearedByRoom[roomId]??[];
 if(current.includes(monsterId)) return state;
 return {...state,clearedByRoom:{...state.clearedByRoom,[roomId]:[...current,monsterId]}};
}

export function isMonsterCleared(state:RoomClearState,roomId:string,monsterId:string):boolean{return (state.clearedByRoom[roomId]??[]).includes(monsterId);}
