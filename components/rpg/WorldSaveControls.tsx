'use client';
import { useState } from 'react';
import type { WorldSimulation } from '../../lib/rpg/simulation-runtime';
import { clearWorld, loadWorld, saveWorld } from '../../lib/rpg/world-save';

export function WorldSaveControls({simulation,onLoad}:{simulation:WorldSimulation;onLoad:(simulation:WorldSimulation)=>void}){
 const [message,setMessage]=useState('');
 return <div className="save-controls"><strong>World Saves</strong><div>{[1,2,3].map(slot=><span key={slot}><button onClick={()=>{saveWorld(slot,simulation);setMessage(`World saved to slot ${slot}.`);}}>Save {slot}</button><button onClick={()=>{const s=loadWorld(slot);if(s){onLoad(s);setMessage(`World loaded from slot ${slot}.`);}else setMessage(`World slot ${slot} is empty.`);}}>Load</button><button onClick={()=>{clearWorld(slot);setMessage(`World slot ${slot} cleared.`);}}>Clear</button></span>)}</div><small>{message}</small></div>;
}
