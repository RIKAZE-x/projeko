import type { GameState } from './types';
import type { SocialState } from './social-runtime';
import type { CanonicalSaveProfile } from './canonical-save';
import { buildSceneProfile } from './scene-profile-builder';
import { getPendingProfile, setPendingProfile, clearPendingProfile } from './scene-profile';

export function writeSceneHandoff(game:GameState,social:SocialState,slot=1,dungeonSeed=0,roomIndex=0){setPendingProfile(buildSceneProfile({...game},social,slot,dungeonSeed,roomIndex));}
export function readSceneHandoff():CanonicalSaveProfile|null{const p=getPendingProfile();if(p)clearPendingProfile();return p;}
export function hasSceneHandoff(){return Boolean(getPendingProfile());}
