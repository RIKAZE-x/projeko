'use client';
import type { RoleState } from '../../lib/rpg/role-system';
import { inspectRolePressure } from '../../lib/rpg/role-discovery';

export function RoleEvolutionPanel({state}:{state:RoleState}){const pressures=inspectRolePressure(state);return <div className="role-evolution"><div className="panel-title"><span>ROLE EVOLUTION</span><span>{state.rank}-RANK</span></div><div className="role-current"><small>CORE</small><h2>{state.core}</h2><p>Origin: {state.origin}</p></div>{pressures.length===0?<p className="muted">The world has not recognized a clear next path yet. Keep acting.</p>:pressures.map(p=><article key={p.role} className={p.progress>=100?'ready':''}><div><b>{p.hidden?'Unknown Path':p.role}</b><small>{p.progress}% pressure</small></div><div className="bar"><i style={{width:`${p.progress}%`}}/></div>{p.progress<100&&<small className="muted">Missing: {p.missing.slice(0,3).join(' · ')}</small>}{p.progress>=100&&<button>Examine Awakening</button>}</article>)}</div>}
