import type { AutosaveCheckpoint } from './autosave';
import { loadCheckpoint } from './autosave-storage';
import { validateSaveProfile, type CanonicalSaveProfile } from './canonical-save';

export function loadLatestAutosave(slot:number):CanonicalSaveProfile|null {
  const checkpoint=loadCheckpoint(slot) as AutosaveCheckpoint|null;
  if(!checkpoint) return null;
  return validateSaveProfile(checkpoint.profile);
}

export function canContinueFromAutosave(slot:number):boolean{return loadLatestAutosave(slot)!==null;}
