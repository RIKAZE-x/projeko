'use client';
import { useMemo, useState } from 'react';
import type { GameState, Skill } from '../../lib/rpg/types';
import { resolveCombatAction, startCombat, type CombatAction, type CombatState } from '../../lib/rpg/combat-runtime';

export function CombatPanel({game,onGameUpdate}:{game:GameState;onGameUpdate:(game:GameState)=>void}){
 const [combat,setCombat]=useState<CombatState>(()=>startCombat(game));
 const skill:Skill|undefined=game.character.skills[0];
 const [message,setMessage]=useState('Choose an action.');
 const view=useMemo(()=>({enemy:Math.max(0,combat.enemyHp/combat.enemyMaxHp*100),player:combat.playerHp}),[combat.enemyHp,combat.enemyMaxHp,combat.playerHp]);
 function act(action:CombatAction){const result=resolveCombatAction(game,combat,action,skill);setCombat(result.state);onGameUpdate(result.game);setMessage(result.state.log[0]??'Action resolved.');}
 return <div className="panel combat-panel"><div className="panel-title"><span>COMBAT · {game.activeMonster.name}</span><span>TURN {combat.turns}</span></div><div className="combat-duel"><section><div className="duel-icon">⚔</div><h3>{game.character.name}</h3><div className="bar"><i style={{width:`${view.player}%`}}/></div><small>HP {combat.playerHp}/100 · MP {combat.playerMana}/100</small>{combat.playerStatuses.length>0&&<p className="status-line">{combat.playerStatuses.map(s=>`${s.id} x${s.stacks}`).join(' · ')}</p>}</section><section><div className="duel-icon">☠</div><h3>{game.activeMonster.name}</h3><div className="bar"><i style={{width:`${view.enemy}%`}}/></div><small>HP {combat.enemyHp.toLocaleString()} / {combat.enemyMaxHp.toLocaleString()}</small>{combat.enemyStatuses.length>0&&<p className="status-line">{combat.enemyStatuses.map(s=>`${s.id} x${s.stacks}`).join(' · ')}</p>}</section></div><div className="combat-actions"><button disabled={combat.victory||combat.defeat||combat.escaped} onClick={()=>act('attack')}>⚔ Attack</button><button disabled={!skill||combat.victory||combat.defeat||combat.escaped} onClick={()=>act('skill')}>✦ {skill?.name??'No Skill'}</button><button disabled={combat.victory||combat.defeat||combat.escaped} onClick={()=>act('guard')}>🛡 Guard</button><button disabled={combat.victory||combat.defeat||combat.escaped} onClick={()=>act('flee')}>↗ Flee</button></div><p className="combat-message">{message}</p>{(combat.victory||combat.defeat||combat.escaped)&&<button className="gold-btn" onClick={()=>setCombat(startCombat(game))}>Start Another Encounter</button>}</div>
}
