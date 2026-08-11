import type { GameState } from './types';
import type { PlayerSkillCast, PlayerSkill } from './player-skill-engine';
import { resolvePlayerSkillAoE } from './player-skill-aoe';

export interface SkillResolution { game:GameState; hit:boolean; damage:number; status?:string; defeated:boolean; reward:{xp:number;gold:number}; }

export function resolvePlayerSkillCast(game:GameState, skill:PlayerSkill, cast:PlayerSkillCast, target:{x:number;y:number}, monster:{x:number;y:number}):SkillResolution {
 const hit=resolvePlayerSkillAoE(skill,cast,target,monster);
 if(!hit) return {game,hit:false,damage:0,defeated:false,reward:{xp:0,gold:0}};
 const current=game.activeMonster;
 if(!current) return {game,hit:true,damage:0,defeated:false,reward:{xp:0,gold:0}};
 const damage=Math.max(1,skill.damage-(current.defense??0));
 const hp=Math.max(0,(current.hp??0)-damage);
 const defeated=hp<=0;
 const reward=defeated?{xp:10+current.level*5,gold:8+current.level*3}:{xp:0,gold:0};
 const logs=[defeated?`Defeated ${current.name}.`:`${skill.name} dealt ${damage} damage to ${current.name}.`,...game.logs].slice(0,50);
 const nextCharacter=defeated?{...game.character,xp:(game.character.xp??0)+reward.xp,gold:game.character.gold+reward.gold}:game.character;
 return {game:{...game,character:nextCharacter,activeMonster:defeated?undefined:{...current,hp},logs},hit:true,damage,status:skill.status,defeated,reward};
}
