export interface BossSessionState { roomKey:string; phase:1|2|3; turn:number; enrage:boolean; telegraphId?:string; }
export function createBossSession(roomKey:string):BossSessionState{return {roomKey,phase:1,turn:0,enrage:false};}
export function mergeBossSession(base:BossSessionState,patch:Partial<BossSessionState>):BossSessionState{return {...base,...patch};}
