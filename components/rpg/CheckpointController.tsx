'use client';
import { useEffect, useState } from 'react';
import type { GameState } from '../../lib/rpg/types';
import type { SocialState } from '../../lib/rpg/social-runtime';
import { createCheckpoint, type CheckpointKind } from '../../lib/rpg/autosave';
import { saveCheckpoint } from '../../lib/rpg/autosave-storage';
import { AutosaveBadge } from './AutosaveBadge';

export function CheckpointController({slot,game,social,dungeonSeed,roomIndex,kind,trigger}:{slot:number;game:GameState;social:SocialState;dungeonSeed:number;roomIndex:number;kind:CheckpointKind;trigger:number}){
 const [saved,setSaved]=useState(false);
 useEffect(()=>{const checkpoint=createCheckpoint(kind,slot,game,social,dungeonSeed,roomIndex);saveCheckpoint(slot,checkpoint);setSaved(true);const t=window.setTimeout(()=>setSaved(false),1800);return()=>window.clearTimeout(t);},[trigger]);
 return <AutosaveBadge visible={saved}/>;
}
