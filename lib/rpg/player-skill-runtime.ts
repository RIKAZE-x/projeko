export interface SkillCooldowns { [skillId:string]: number }
export interface SkillCast { skillId:string; target:{x:number;y:number}; createdAt:number }

export function canCast(skillId:string,cooldowns:SkillCooldowns,turn:number){return (cooldowns[skillId]??0)<=turn;}
export function startCooldown(skillId:string,cooldowns:SkillCooldowns,turn:number,cooldown:number):SkillCooldowns{return {...cooldowns,[skillId]:turn+cooldown};}
export function createSkillCast(skillId:string,target:{x:number;y:number}):SkillCast{return {skillId,target,createdAt:Date.now()};}
