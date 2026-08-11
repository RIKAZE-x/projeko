import type { GameState } from './types';

export const GAME_VERSION = 1 as const;
export interface VerticalSliceState { version:1; state:GameState; dungeonSeed:number; roomIndex:number; }

export function validateGameState(state:GameState):string[]{
 const errors:string[]=[];
 if(!state.character?.id) errors.push('character.id missing');
 if(state.character?.level<1) errors.push('character.level invalid');
 if(!state.location) errors.push('location missing');
 if(!state.economy) errors.push('economy missing');
 if(!Array.isArray(state.party)) errors.push('party must be array');
 if(!Array.isArray(state.logs)) errors.push('logs must be array');
 return errors;
}

export function createVerticalSlice(state:GameState,dungeonSeed:number,roomIndex=0):VerticalSliceState{
 const errors=validateGameState(state); if(errors.length) throw new Error(`Invalid game state: ${errors.join(', ')}`);
 return {version:GAME_VERSION,state,dungeonSeed,roomIndex};
}

export function normalizeLoadedSlice(payload:unknown):VerticalSliceState|null{
 if(!payload || typeof payload!=='object') return null;
 const candidate=payload as Partial<VerticalSliceState>;
 if(candidate.version!==1 || typeof candidate.dungeonSeed!=='number' || typeof candidate.roomIndex!=='number' || !candidate.state) return null;
 return candidate as VerticalSliceState;
}
