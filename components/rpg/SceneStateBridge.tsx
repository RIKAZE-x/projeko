'use client';
import { useEffect, useState } from 'react';
import type { CanonicalSaveProfile } from '../../lib/rpg/canonical-save';
import { getPendingProfile, clearPendingProfile } from '../../lib/rpg/scene-profile';
import { hydrateProfile } from '../../lib/rpg/profile-bridge';
import type { GameState } from '../../lib/rpg/types';
import type { SocialState } from '../../lib/rpg/social-runtime';

export interface SceneRuntime { game:GameState; social:SocialState; dungeonSeed:number; roomIndex:number; }
export function useSceneRuntime(fallbackGame:GameState,fallbackSocial:SocialState):SceneRuntime {
 const [runtime,setRuntime]=useState<SceneRuntime>(()=>({game:structuredClone(fallbackGame),social:structuredClone(fallbackSocial),dungeonSeed:Date.now(),roomIndex:0}));
 useEffect(()=>{const pending=getPendingProfile();if(!pending)return;const hydrated=hydrateProfile(pending as CanonicalSaveProfile);setRuntime(hydrated);clearPendingProfile();},[]);
 return runtime;
}
