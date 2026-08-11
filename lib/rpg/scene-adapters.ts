import type { GameState } from './types';
import type { SocialState } from './social-runtime';
import type { CanonicalSaveProfile } from './canonical-save';
import { createSaveProfile } from './canonical-save';

export function adaptSceneProfile(profile:CanonicalSaveProfile, location:string):CanonicalSaveProfile {
 const game=structuredClone(profile.game); game.location=location; game.logs=[`Entered ${location}.`,...game.logs].slice(0,20);
 return createSaveProfile(profile.slot,game,profile.social,profile.session,profile.meta.playtimeSeconds);
}

export function mergeSceneRuntime(game:GameState,social:SocialState,profile:CanonicalSaveProfile):CanonicalSaveProfile {
 return createSaveProfile(profile.slot,game,social,profile.session,profile.meta.playtimeSeconds);
}
