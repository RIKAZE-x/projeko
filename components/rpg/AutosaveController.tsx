'use client';
import { useEffect, useState } from 'react';
import type { GameState } from '../../lib/rpg/types';
import type { SocialState } from '../../lib/rpg/social-runtime';
import { createCheckpoint, type CheckpointKind } from '../../lib/rpg/autosave';
import { saveCheckpoint } from '../../lib/rpg/autosave-storage';
import { AutosaveBadge } from './AutosaveBadge';

export function AutosaveController({slot,game,social,dungeonSeed,roomIndex,kind,enabled=true}:{slot:number;game:GameState;social:SocialState;dungeonSeed:number;roomIndex:number;kind:CheckpointKind;enabled?:boolean}){
 const [savedAt,setSavedAt]=useState(0);
 useEffect(()=>{if(!enabled)return;const checkpoint=createCheckpoint(kind,slot,game,social,dungeonSeed,roomIndex);saveCheckpoint(slot,checkpoint);setSavedAt(Date.now());},[slot,kind,enabled,game,social,dungeonSeed,roomIndex]);
 return <AutosaveBadge timestamp={savedAt}/>;
}
