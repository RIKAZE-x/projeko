'use client';
import { useEffect, useState } from 'react';
import type { GameState } from '../../lib/rpg/types';
import type { SocialState } from '../../lib/rpg/social-runtime';
import { readSceneHandoff } from '../../lib/rpg/scene-runtime';
import { hydrateProfile } from '../../lib/rpg/profile-bridge';

export function useCanonicalSceneRuntime(fallbackGame:GameState,fallbackSocial:SocialState){
 const [game,setGame]=useState<GameState>(fallbackGame); const [social,setSocial]=useState<SocialState>(fallbackSocial); const [dungeonSeed,setDungeonSeed]=useState(0); const [roomIndex,setRoomIndex]=useState(0);
 useEffect(()=>{const profile=readSceneHandoff();if(!profile)return;const hydrated=hydrateProfile(profile);setGame(hydrated.game);setSocial(hydrated.social);setDungeonSeed(hydrated.dungeonSeed);setRoomIndex(hydrated.roomIndex);},[]);
 return {game,setGame,social,setSocial,dungeonSeed,roomIndex};
}
