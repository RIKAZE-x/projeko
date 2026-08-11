'use client';
import { useRouter } from 'next/navigation';
import { MainMenu } from '../components/rpg/MainMenu';
import { continueAutosave } from '../lib/rpg/autosave-continue';
import type { GameState } from '../lib/rpg/types';
import type { CanonicalSaveProfile } from '../lib/rpg/canonical-save';
import type { SocialState } from '../lib/rpg/social-runtime';

function writePending(profile:CanonicalSaveProfile){sessionStorage.setItem('veilbound.pendingProfile',JSON.stringify(profile));}
function legacyProfile(state:GameState):CanonicalSaveProfile { const social:SocialState={quest:{active:[],completed:[],failed:[],flags:{},reputation:{}},npcFlags:{},dialogueHistory:[]}; return {version:2,savedAt:new Date().toISOString(),slot:1,game:state,social,session:{dungeonSeed:Date.now(),roomIndex:0},meta:{name:state.character.name,level:state.character.level,location:state.location,playtimeSeconds:0}}; }
export default function Home(){
 const router=useRouter();
 function start(state:GameState){writePending(legacyProfile(state));router.push('/game');}
 function cont(state:GameState){const auto=continueAutosave(1);if(auto){writePending(auto.profile);router.push('/game');return;}writePending(legacyProfile(state));router.push('/game');}
 return <main className="rpg-shell"><MainMenu onStart={start} onContinue={cont}/></main>;
}
