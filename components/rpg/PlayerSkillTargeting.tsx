'use client';
import { useMemo, useState } from 'react';
import type { GridPoint } from '../../lib/rpg/boss-aoe';
import { PLAYER_SKILLS, type PlayerSkill } from '../../lib/rpg/player-skill-engine';
import { skillArea, canTarget } from '../../lib/rpg/player-skill-aoe';
import { canCast, createSkillCast, startCooldown, type SkillCooldowns } from '../../lib/rpg/player-skill-runtime';

export function PlayerSkillTargeting({player,target,onCast}:{player:GridPoint;target:GridPoint;onCast:(cast:{skillId:string;target:GridPoint})=>void}){
 const [selected,setSelected]=useState<PlayerSkill>(PLAYER_SKILLS[0]);
 const [turn,setTurn]=useState(0); const [cooldowns,setCooldowns]=useState<SkillCooldowns>({});
 const area=useMemo(()=>skillArea(selected, target),[selected,target]);
 const ready=canCast(selected.id,cooldowns,turn)&&canTarget(selected,player,target);
 function cast(){if(!ready)return;onCast(createSkillCast(selected.id,target));setCooldowns(c=>startCooldown(selected.id,c,turn,selected.cooldown));setTurn(t=>t+1);}
 return <div className="skill-targeting"><div className="skill-list">{PLAYER_SKILLS.map(skill=><button key={skill.id} className={selected.id===skill.id?'active':''} onClick={()=>setSelected(skill)}>{skill.name}<small>CD {Math.max(0,(cooldowns[skill.id]??0)-turn)}</small></button>)}</div><div className="skill-preview"><strong>{selected.name}</strong><span>{selected.shape} · {selected.damage} dmg · range {selected.range}</span><div className="skill-tiles">{area.map(p=><span key={`${p.x}-${p.y}`} className="skill-tile" style={{left:p.x*32,top:p.y*32}} />)}</div><button disabled={!ready} onClick={cast}>Cast Skill</button></div></div>;
}
