'use client';
import { useEffect, useState } from 'react';
import type { GameState } from '../../lib/rpg/types';
import { createNewGameState } from '../../lib/rpg/bootstrap';
import { loadSlot, saveSlot } from '../../lib/rpg/save-system';
import styles from './MainMenu.module.css';

export function MainMenu({onStart,onContinue}:{onStart:(state:GameState)=>void;onContinue:(state:GameState)=>void}){
 const [slots,setSlots]=useState<(GameState|null)[]>([null,null,null]);
 const [message,setMessage]=useState('');
 useEffect(()=>{setSlots([1,2,3].map(i=>loadSlot(i)));},[]);
 function newGame(){const state=createNewGameState();saveSlot(1,state);onStart(state);}
 function load(slot:number){const state=loadSlot(slot);if(state)onContinue(state);else setMessage(`Save Slot ${slot} kosong.`);}
 return <section className={styles.menuScreen}><div className={styles.menuCard}><div className={styles.kicker}>CHRONICLES OF THE LAST FLAME</div><h1 className={styles.title}>VEILBOUND</h1><p className={styles.subtitle}>A living dark-fantasy RPG where choices change the world.</p><div className={styles.actions}><button className={styles.action} onClick={newGame}>New Game</button>{[1,2,3].map(slot=><button className={styles.action} key={slot} onClick={()=>load(slot)} disabled={!slots[slot-1]}>{slots[slot-1]?`Continue Slot ${slot}`:`Slot ${slot} — Empty`}</button>)}</div>{message&&<p className={styles.message}>{message}</p>}<div className={styles.note}>Your character, world economy, factions, quests and dungeon progress are designed to become persistent.</div></div></section>;
}
