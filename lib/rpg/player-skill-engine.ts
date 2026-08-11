export type SkillShape='single'|'line'|'cross'|'cone'|'ring';
export interface PlayerSkill {id:string;name:string;shape:SkillShape;range:number;damage:number;cooldown:number;status?:'burn'|'bleed'|'stun';}
export interface SkillRuntime {cooldowns:Record<string,number>;selected?:string;}
export const PLAYER_SKILLS:PlayerSkill[]=[
 {id:'ember-slash',name:'Ember Slash',shape:'line',range:2,damage:18,cooldown:2,status:'burn'},
 {id:'void-pulse',name:'Void Pulse',shape:'ring',range:2,damage:14,cooldown:3,status:'bleed'},
 {id:'ward-breaker',name:'Ward Breaker',shape:'cross',range:3,damage:24,cooldown:4,status:'stun'},
];
export function canCast(state:SkillRuntime,skill:PlayerSkill){return (state.cooldowns[skill.id]??0)<=0;}
export function spendCooldown(state:SkillRuntime,skill:PlayerSkill){return {...state,cooldowns:{...state.cooldowns,[skill.id]:skill.cooldown},selected:skill.id};}
export function tickCooldowns(state:SkillRuntime):SkillRuntime{return {...state,cooldowns:Object.fromEntries(Object.entries(state.cooldowns).map(([k,v])=>[k,Math.max(0,v-1)]))};}
