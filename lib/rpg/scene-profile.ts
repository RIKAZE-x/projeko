import type { CanonicalSaveProfile } from './canonical-save';

const KEY='veilbound.pendingProfile';
export function setPendingProfile(profile:CanonicalSaveProfile){if(typeof window!=='undefined')sessionStorage.setItem(KEY,JSON.stringify(profile));}
export function takePendingProfile():CanonicalSaveProfile|null{if(typeof window==='undefined')return null;const raw=sessionStorage.getItem(KEY);if(!raw)return null;sessionStorage.removeItem(KEY);try{return JSON.parse(raw) as CanonicalSaveProfile;}catch{return null;}}
export function peekPendingProfile():CanonicalSaveProfile|null{if(typeof window==='undefined')return null;const raw=sessionStorage.getItem(KEY);if(!raw)return null;try{return JSON.parse(raw) as CanonicalSaveProfile;}catch{return null;}}
