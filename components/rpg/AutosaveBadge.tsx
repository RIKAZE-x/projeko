'use client';
import { useEffect, useState } from 'react';
import type { AutosaveCheckpoint } from '../../lib/rpg/autosave';
import { saveCheckpoint } from '../../lib/rpg/autosave-storage';
import type { GameState } from '../../lib/rpg/types';
import type { SocialState } from '../../lib/rpg/social-runtime';
import { checkpointFor, type AutosaveEvent } from '../../lib/rpg/autosave-events';

export function AutosaveBadge({event,slot,game,social,dungeonSeed,roomIndex}:{event:AutosaveEvent;slot:number;game:GameState;social:SocialState;dungeonSeed:number;roomIndex:number}){
 const [saved,setSaved]=useState(false);
 useEffect(()=>{const checkpoint:AutosaveCheckpoint=checkpointFor(event,slot,game,social,dungeonSeed,roomIndex);saveCheckpoint(slot,checkpoint);setSaved(true);const t=window.setTimeout(()=>setSaved(false),1800);return()=>window.clearTimeout(t);},[event,slot,game,social,dungeonSeed,roomIndex]);
 return <span aria-live="polite" className={saved?'autosave-badge visible':'autosave-badge'}>{saved?'Autosaved':'·'}</span>;
}
