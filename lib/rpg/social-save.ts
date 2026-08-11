import type { SocialState } from './social-runtime';

export interface SocialSave { version:1; savedAt:string; state:SocialState; }
export function serializeSocial(state:SocialState):SocialSave{return {version:1,savedAt:new Date().toISOString(),state};}
export function deserializeSocial(input:unknown):SocialState|null{if(!input||typeof input!=='object')return null;const x=input as Partial<SocialSave>;if(x.version!==1||!x.state)return null;return x.state;}
