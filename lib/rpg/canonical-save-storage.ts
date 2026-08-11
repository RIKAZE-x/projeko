import type { CanonicalSaveProfile } from './canonical-save';
import { validateSaveProfile } from './canonical-save';

const PREFIX='veilbound.profile.v2.';

export function saveProfile(profile:CanonicalSaveProfile){if(typeof window==='undefined')return;localStorage.setItem(`${PREFIX}${profile.slot}`,JSON.stringify(profile));}
export function loadProfile(slot:number):CanonicalSaveProfile|null{if(typeof window==='undefined')return null;const raw=localStorage.getItem(`${PREFIX}${slot}`);if(!raw)return null;try{return validateSaveProfile(JSON.parse(raw));}catch{return null;}}
export function clearProfile(slot:number){if(typeof window!=='undefined')localStorage.removeItem(`${PREFIX}${slot}`);}
