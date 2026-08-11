import type { GameState } from './types';
import type { SocialState } from './social-runtime';
import { createAutosaveCheckpoint, type AutosaveCheckpoint } from './autosave';

export type AutosaveEvent='boot'|'town-enter'|'travel-complete'|'dungeon-room'|'combat-victory'|'quest-choice'|'evolution';

export function checkpointFor(event:AutosaveEvent,slot:number,game:GameState,social:SocialState,dungeonSeed:number,roomIndex:number):AutosaveCheckpoint {
  return createAutosaveCheckpoint(slot,event,game,social,dungeonSeed,roomIndex);
}
