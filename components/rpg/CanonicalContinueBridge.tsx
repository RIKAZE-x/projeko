'use client';
import { useRouter } from 'next/navigation';
import type { CanonicalSaveProfile } from '../../lib/rpg/canonical-save';
import { loadCanonicalSave } from '../../lib/rpg/canonical-save-storage';

export function CanonicalContinueBridge(){
 const router=useRouter();
 function continueSlot(slot:number){const profile=loadCanonicalSave(slot);if(!profile)return;sessionStorage.setItem('veilbound.pendingCanonical',JSON.stringify(profile));router.push('/game');}
 return <div className="continue-grid">{[1,2,3].map(slot=><button key={slot} onClick={()=>continueSlot(slot)}>Continue Slot {slot}</button>)}</div>;
}
