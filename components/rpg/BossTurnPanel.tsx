'use client';
import { useState } from 'react';
import type { BossCombatState } from '../../lib/rpg/boss-combat-engine';
import { beginBossTurn, resolveBossTurn } from '../../lib/rpg/boss-turn-runtime';
import type { GridPoint } from '../../lib/rpg/boss-aoe';

export function BossTurnPanel({state,hp,maxHp,player,origin,onResolve}:{state:BossCombatState;hp:number;maxHp:number;player:GridPoint;origin:GridPoint;onResolve:(result:{hit:boolean;damage:number;status?:'burn'|'bleed'|'stun'})=>void}){
 const [runtime,setRuntime]=useState(state);
 const [message,setMessage]=useState('');
 const telegraph=runtime.telegraph;
 function prepare(){setRuntime(beginBossTurn(runtime,hp,maxHp));setMessage('');}
 function resolve(){const result=resolveBossTurn(runtime,player,origin);setRuntime(result.state);setMessage(result.hit?`Hit! -${result.damage}${result.status?` · ${result.status}`:''}`:'Dodged!');onResolve(result);}
 return <section className="boss-turn-panel"><header><strong>Boss Phase {runtime.phase}</strong><span>{runtime.enrage?'ENRAGED':''}</span></header>{telegraph?<div className="boss-telegraph-copy"><b>{telegraph.name}</b><span>{telegraph.shape} · warning {telegraph.warningTurns} turn · {telegraph.damage} dmg</span><button onClick={resolve}>Resolve Attack</button></div>:<button onClick={prepare}>Prepare Boss Attack</button>}{message&&<p aria-live="polite">{message}</p>}</section>;
}
