import type { GameState } from './types';
import type { SocialState } from './social-runtime';
import type { CanonicalSaveProfile } from './canonical-save';

export interface HydratedProfile { game:GameState; social:SocialState; dungeonSeed:number; roomIndex:number; }
export function hydrateProfile(profile:CanonicalSaveProfile):HydratedProfile{return {game:structuredClone(profile.game),social:structuredClone(profile.social),dungeonSeed:profile.session.dungeonSeed,roomIndex:profile.session.roomIndex};}
