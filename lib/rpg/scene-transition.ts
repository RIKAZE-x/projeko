import type { CanonicalSaveProfile } from './canonical-save';
import { adaptSceneProfile } from './scene-adapters';

export type SceneId='game'|'town'|'world'|'npcs';

export function transitionProfile(profile:CanonicalSaveProfile,scene:SceneId):CanonicalSaveProfile {
 const locations:Record<SceneId,string>={game:profile.game.location,town:'Valerion',world:'Emberfall Region',npcs:profile.game.location};
 return adaptSceneProfile(profile,locations[scene]);
}
