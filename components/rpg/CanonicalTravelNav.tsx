'use client';
import { useRouter } from 'next/navigation';
import type { GameState } from '../../lib/rpg/types';
import type { SocialState } from '../../lib/rpg/social-runtime';
import { buildSceneProfile } from '../../lib/rpg/scene-profile-builder';
import { setPendingProfile } from '../../lib/rpg/scene-profile';
const EMPTY_SOCIAL:SocialState={quest:{active:[],completed:[],failed:[],flags:{},reputation:{}},npcFlags:{},dialogueHistory:[]};
export function CanonicalTravelNav({state,social}:{state:GameState;social?:SocialState}){const router=useRouter();function go(path:string,location:string){const next={...structuredClone(state),location,logs:[`Travelled to ${location}.`,...state.logs].slice(0,20)};setPendingProfile(buildSceneProfile(next,social??EMPTY_SOCIAL));router.push(path)}return <div className="travel-nav"><button onClick={()=>go('/town','Valerion')}>Valerion</button><button onClick={()=>go('/world','Emberfall Region')}>World Map</button><button onClick={()=>go('/game',state.location)}>Return to Dungeon</button></div>}
