'use client';
import { useState } from 'react';
import type { GameState } from '../../lib/rpg/types';
import { loadSlot, saveSlot } from '../../lib/rpg/save-system';

export function SaveControls({state,onLoad}:{state:GameState;onLoad:(state:GameState)=>void}){
 const [message,setMessage]=useState('');
 function save(slot:number){saveSlot(slot,state);setMessage(`Saved slot ${slot}.`);}
 function load(slot:number){const loaded=loadSlot(slot);setMessage(loaded?`Loaded slot ${slot}.`:`Slot ${slot} is empty.`);if(loaded)onLoad(loaded);}
 return <div className="save-controls"><strong>Save Game</strong><div>{[1,2,3].map(slot=><span key={slot}><button onClick={()=>save(slot)}>Save {slot}</button><button onClick={()=>load(slot)}>Load</button></span>)}</div><small>{message}</small></div>;
}
