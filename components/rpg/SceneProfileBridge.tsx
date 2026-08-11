'use client';
import { useRouter } from 'next/navigation';
import type { CanonicalSaveProfile } from '../../lib/rpg/canonical-save';
import { setPendingProfile } from '../../lib/rpg/scene-profile';
export function SceneProfileBridge({profile,to,label}:{profile:CanonicalSaveProfile;to:string;label:string}){const router=useRouter();return <button onClick={()=>{setPendingProfile(profile);router.push(to)}}>{label}</button>}
