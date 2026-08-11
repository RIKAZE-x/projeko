'use client';
import { useState } from 'react';
import type { GameState } from '../../lib/rpg/types';
import { PLAYER_SKILLS, type PlayerSkillId } from '../../lib/rpg/player-skill-engine';
import { resolvePlayerSkillCast } from '../../lib/rpg/player-skill-resolution';

export function PlayerSkillCombatBridge({game,onGameUpdate,playerPosition,monsterPosition}:{game:GameState;onGameUpdate:(game:GameState,defeated:boolean)=>void;playerPosition:{x:number;y:number};monsterPosition:{x:number;y:number}}){
 const [selected,setSelected]=useState<PlayerSkillId>('ember-slash');
 const skill=PLAYER_SKILLS[selected];
 return <section className="skill-combat-bridge"><div className="skill-list">{Object.values(PLAYER_SKILLS).map(s=><button key={s.id} disabled={s.cooldown>0} className={selected===s.id?'active':''} onClick={()=>setSelected(s.id)}>{s.name} · {s.damage} dmg</button>)}</div><p>{skill.name} · Range {skill.range} · Cooldown {skill.cooldown}</p><button onClick={()=>{const cast={skillId:skill.id,createdAt:Date.now()};const result=resolvePlayerSkillCast(game,skill,cast,monsterPosition,monsterPosition);onGameUpdate(result.game,result.defeated);}}>Cast Skill</button></section>;
}
