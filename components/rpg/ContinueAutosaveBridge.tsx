'use client';
import { useRouter } from 'next/navigation';
import { canContinueFromAutosave, loadLatestAutosave } from '../../lib/rpg/autosave-continue';

export function ContinueAutosaveBridge({slot=1}:{slot?:number}){
 const router=useRouter();
 const available=canContinueFromAutosave(slot);
 function continueGame(){const profile=loadLatestAutosave(slot);if(!profile)return;sessionStorage.setItem('veilbound.pendingProfile',JSON.stringify(profile));router.push('/game');}
 return <button onClick={continueGame} disabled={!available}>{available?'Continue Autosave':'No Autosave'}</button>;
}
