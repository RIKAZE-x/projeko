'use client';
import { useEffect, useState } from 'react';
import type { GameState } from '../../lib/rpg/types';
import { createNewGameState } from '../../lib/rpg/bootstrap';
import { loadSlot, saveSlot } from '../../lib/rpg/save-system';

export function MainMenu({onStart,onContinue}:{onStart:(state:GameState)=>void;onContinue:(state:GameState)=>void}){
 const [slots,setSlots]=useState<(GameState|null)[]>([null,null,null]);
 const [message,setMessage]=useState('');
 useEffect(()=>{setSlots([1,2,3].map(i=>loadSlot(i)));},[]);
 function newGame(){const state=createNewGameState();saveSlot(1,state);onStart(state);}
 function load(slot:number){const state=loadSlot(slot);if(state)onContinue(state);else setMessage(`Save Slot ${slot} kosong.`);}
 return <section className="menu-screen"><div className="menu-card"><div className="menu-kicker">CHRONICLES OF THE LAST FLAME</div><h1>VEILBOUND</h1><p className="menu-subtitle">A living dark-fantasy RPG where choices change the world.</p><div className="menu-actions"><button onClick={newGame}>New Game</button>{[1,2,3].map(slot=><button key={slot} onClick={()=>load(slot)} disabled={!slots[slot-1]}>{slots[slot-1]?`Continue Slot ${slot}`:`Slot ${slot} — Empty`}</button>)}</div>{message&&<p className="menu-message">{message}</p>}<div className="menu-note">Your character, world economy, factions, quests and dungeon progress are designed to become persistent.</div></div></section>;
}
