'use client';
import { useMemo, useState } from 'react';
import { createArenaState, resolveBossResponse, resolvePlayerAction, startBossTelegraph, tickArena, type ArenaState } from '../../lib/rpg/tactical-arena-controller';
import type { GameState } from '../../lib/rpg/types';

interface Props { game:GameState; action:Parameters<typeof resolvePlayerAction>[1]; bossOrigin:{x:number;y:number}; playerPosition:{x:number;y:number}; }
export function TacticalArenaController({game,action,bossOrigin,playerPosition}:Props){
 const enemyHp=game.activeMonster?.hp??0; const enemyMaxHp=game.activeMonster?.maxHp??enemyHp;
 const [state,setState]=useState<ArenaState>(()=>createArenaState(game.character.hp??100,enemyHp));
 const [status,setStatus]=useState('Ready');
 const runPlayer=()=>{const result=resolvePlayerAction(state,action,game);setState(result.state);setStatus(result.action.ok?result.action.message:result.action.reason??'Action failed');if(result.state.outcome==='active'&&result.state.boss){const t=startBossTelegraph(tickArena(result.state));const r=resolveBossResponse(t,playerPosition,bossOrigin);setState(r.state);setStatus(r.result.hit?`Boss hit for ${r.result.damage}.`:'Boss attack dodged.');}};
 const reset=()=>{setState(createArenaState(game.character.hp??100,enemyHp));setStatus('Ready');};
 const tone=useMemo(()=>state.outcome==='victory'?'Victory':state.outcome==='defeat'?'Defeat':`Turn ${state.turn}`,[state.outcome,state.turn]);
 return <section className="tactical-arena-controller"><header><strong>{tone}</strong><span>HP {state.playerHp}/{state.playerMaxHp} · Enemy {state.enemyHp}/{state.enemyMaxHp}</span></header><p>{status}</p>{state.outcome==='active'?<button onClick={runPlayer}>Execute Turn</button>:<button onClick={reset}>Restart Encounter</button>}</section>;
}
