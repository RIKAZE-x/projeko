'use client';
import { useState } from 'react';
import type { CanonicalSaveProfile } from '../../lib/rpg/canonical-save';
import { createSaveProfile } from '../../lib/rpg/canonical-save';
import { saveProfile, loadProfile, clearProfile } from '../../lib/rpg/canonical-save-storage';
import type { GameState } from '../../lib/rpg/types';
import type { SocialState } from '../../lib/rpg/social-runtime';

export function CanonicalSaveControls({slot,game,social,dungeonSeed,roomIndex,onLoad}:{slot:number;game:GameState;social:SocialState;dungeonSeed:number;roomIndex:number;onLoad:(profile:CanonicalSaveProfile)=>void}){
 const [message,setMessage]=useState('');
 function save(){const profile=createSaveProfile(slot,game,social,{dungeonSeed,roomIndex});saveProfile(profile);setMessage(`Saved Slot ${slot}.`);}
 function load(){const profile=loadProfile(slot);if(!profile){setMessage(`Slot ${slot} is empty.`);return;}onLoad(profile);setMessage(`Loaded Slot ${slot}.`);}
 function clear(){clearProfile(slot);setMessage(`Cleared Slot ${slot}.`);}
 return <div className="save-controls"><div className="panel-title">CANONICAL SAVE · SLOT {slot}</div><div className="combat-actions"><button onClick={save}>Save All</button><button onClick={load}>Load All</button><button onClick={clear}>Clear</button></div>{message&&<p>{message}</p>}</div>;
}
