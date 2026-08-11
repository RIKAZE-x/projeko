import type { GameState } from './types';
import type { SocialState } from './social-runtime';
import type { Item } from './types';

export interface CanonicalSaveProfile {
 version:2;
 savedAt:string;
 slot:number;
 game:GameState;
 social:SocialState;
 session:{dungeonSeed:number;roomIndex:number;roomClears?:string[];claimedLoot?:string[]};
 meta:{name:string;level:number;location:string;playtimeSeconds:number};
 persistence:{inventoryItems:Item[];victoryKeys:string[];claimedLootKeys:string[]};
}

export function createSaveProfile(slot:number,game:GameState,social:SocialState,session:CanonicalSaveProfile['session'],playtimeSeconds=0,persistence:Partial<CanonicalSaveProfile['persistence']>={}):CanonicalSaveProfile {
 return {version:2,savedAt:new Date().toISOString(),slot,game,social,session,meta:{name:game.character.name,level:game.character.level,location:game.location,playtimeSeconds},persistence:{inventoryItems:persistence.inventoryItems??[],victoryKeys:persistence.victoryKeys??[],claimedLootKeys:persistence.claimedLootKeys??[]}};
}

export function validateSaveProfile(input:unknown):CanonicalSaveProfile|null {
 if(!input||typeof input!=='object') return null;
 const x=input as Partial<CanonicalSaveProfile>;
 if(x.version!==2||!x.game||!x.social||!x.session) return null;
 if(typeof x.session.dungeonSeed!=='number'||typeof x.session.roomIndex!=='number') return null;
 const p=x.persistence??{inventoryItems:[],victoryKeys:[],claimedLootKeys:[]};
 return {...x,persistence:{inventoryItems:p.inventoryItems??[],victoryKeys:p.victoryKeys??[],claimedLootKeys:p.claimedLootKeys??[]}} as CanonicalSaveProfile;
}
