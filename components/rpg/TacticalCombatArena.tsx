'use client';
import { useMemo, useState } from 'react';
import type { GameState } from '../../lib/rpg/types';
import { PLAYER_SKILLS, type PlayerSkillId } from '../../lib/rpg/player-skill-engine';
import { PlayerSkillTargeting } from './PlayerSkillTargeting';
import { TacticalCombatStatus } from './TacticalCombatStatus';
import { BossTelegraphPanel } from './BossTelegraphPanel';

interface Props { game:GameState; enemyName:string; enemyHp:number; playerPosition:{x:number;y:number}; enemyPosition:{x:number;y:number}; isBoss?:boolean; onAction:(skillId:PlayerSkillId,target:{x:number;y:number})=>void; }
export function TacticalCombatArena({game,enemyName,enemyHp,playerPosition,enemyPosition,isBoss=false,onAction}:Props){
 const [skill,setSkill]=useState<PlayerSkillId>('ember-slash');
 const active=useMemo(()=>PLAYER_SKILLS.find(s=>s.id===skill)!,[skill]);
 return <section className="tactical-arena">
  <div className="tactical-header"><div><span className="eyebrow">TACTICAL COMBAT</span><h2>{enemyName}</h2></div><span className="enemy-hp">Enemy HP {enemyHp}</span></div>
  <div className="tactical-body">
   <div className="tactical-board"><PlayerSkillTargeting skillId={active.id} player={playerPosition} target={enemyPosition} onCast={(target)=>onAction(active.id,target)}/></div>
   <aside className="tactical-side">
    <div className="skill-list">{PLAYER_SKILLS.map(s=><button key={s.id} className={s.id===skill?'active':''} onClick={()=>setSkill(s.id)}>{s.name}<small>CD {s.cooldown} · {s.damage} dmg</small></button>)}</div>
    <TacticalCombatStatus playerHp={game.character.hp} playerMaxHp={game.character.maxHp} enemyHp={enemyHp} enemyMaxHp={game.activeMonster?.maxHp??enemyHp} turn={1} cooldowns={{[active.id]:0}} statuses={[]}/>
    {isBoss&&<BossTelegraphPanel state={{phase:1,turn:1,enrage:false}}/>}
   </aside>
  </div>
 </section>;
}
