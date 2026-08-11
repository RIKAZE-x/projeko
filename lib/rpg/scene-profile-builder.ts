import type { GameState } from './types';
import type { SocialState } from './social-runtime';
import { createSaveProfile, type CanonicalSaveProfile } from './canonical-save';

export function buildSceneProfile(game:GameState,social:SocialState,slot=1,seed=0,roomIndex=0,playtimeSeconds=0):CanonicalSaveProfile {
 return createSaveProfile(slot,structuredClone(game),structuredClone(social),{dungeonSeed:seed,roomIndex},playtimeSeconds);
}
