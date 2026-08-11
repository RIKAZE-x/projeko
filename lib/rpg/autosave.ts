import type { GameState } from './types';
import type { SocialState } from './social-runtime';
import { createSaveProfile, type CanonicalSaveProfile } from './canonical-save';

export type CheckpointKind='boot'|'town'|'travel'|'dungeon-room'|'combat-victory'|'quest'|'evolution';
export interface AutosaveCheckpoint { kind:CheckpointKind; createdAt:string; profile:CanonicalSaveProfile; }

export function createCheckpoint(kind:CheckpointKind,slot:number,game:GameState,social:SocialState,dungeonSeed:number,roomIndex:number,playtimeSeconds=0):AutosaveCheckpoint {
 return {kind,createdAt:new Date().toISOString(),profile:createSaveProfile(slot,game,social,{dungeonSeed,roomIndex},playtimeSeconds)};
}

export function shouldAutosave(kind:CheckpointKind){return ['town','travel','dungeon-room','combat-victory','quest','evolution'].includes(kind);}
