import type { GameState } from './types';
import type { SocialState } from './social-runtime';

export interface CanonicalSaveProfile {
 version:2;
 savedAt:string;
 slot:number;
 game:GameState;
 social:SocialState;
 session:{dungeonSeed:number;roomIndex:number};
 meta:{name:string;level:number;location:string;playtimeSeconds:number};
}

export function createSaveProfile(slot:number,game:GameState,social:SocialState,session:CanonicalSaveProfile['session'],playtimeSeconds=0):CanonicalSaveProfile {
 return {version:2,savedAt:new Date().toISOString(),slot,game,social,session,meta:{name:game.character.name,level:game.character.level,location:game.location,playtimeSeconds}};
}

export function validateSaveProfile(input:unknown):CanonicalSaveProfile|null {
 if(!input||typeof input!=='object') return null;
 const x=input as Partial<CanonicalSaveProfile>;
 if(x.version!==2||!x.game||!x.social||!x.session) return null;
 if(typeof x.session.dungeonSeed!=='number'||typeof x.session.roomIndex!=='number') return null;
 return x as CanonicalSaveProfile;
}
