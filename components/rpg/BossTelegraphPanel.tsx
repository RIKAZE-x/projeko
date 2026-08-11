'use client';
import type { BossCombatState } from '../../lib/rpg/boss-combat-engine';

export function BossTelegraphPanel({state}:{state:BossCombatState}){
 if(!state.telegraph)return null;
 return <div className="boss-telegraph" aria-live="polite"><strong>TELEGRAPH: {state.telegraph.name}</strong><span>Phase {state.phase} · {state.telegraph.warningTurns} turn warning · {state.telegraph.shape} · {state.telegraph.damage} damage{state.telegraph.status?` · ${state.telegraph.status}`:''}</span>{state.enrage&&<em>ENRAGED</em>}</div>;
}
