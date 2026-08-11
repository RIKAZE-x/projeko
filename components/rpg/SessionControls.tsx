'use client';
import { useState } from 'react';
import type { GameState } from '../../lib/rpg/types';
import { saveSession, loadSession, clearSession } from '../../lib/rpg/session-save';

export function SessionControls({state,dungeonSeed,roomIndex,onLoad}:{state:GameState;dungeonSeed:number;roomIndex:number;onLoad:(payload:{state:GameState;dungeonSeed:number;roomIndex:number})=>void}){
 const [message,setMessage]=useState('');
 return <div className="save-controls session-controls"><strong>Continue Session</strong><div><button onClick={()=>{saveSession(state,dungeonSeed,roomIndex);setMessage('Session saved.')}}>Save Session</button><button onClick={()=>{const payload=loadSession();if(payload){onLoad({state:payload.state,dungeonSeed:payload.dungeonSeed,roomIndex:payload.roomIndex});setMessage('Session loaded.')}else setMessage('No session save found.')}}>Load Session</button><button onClick={()=>{clearSession();setMessage('Session cleared.')}}>Clear</button></div><small>{message}</small></div>;
}
