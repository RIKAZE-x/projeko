import type { RoleState, EvolutionRule } from './role-system';
import { ROLE_EVOLUTIONS, discoverEvolutions } from './role-system';

export interface RolePressure { role:string; progress:number; missing:string[]; hidden:boolean; ready:boolean; }

function progressFor(state:RoleState, rule:EvolutionRule){
 const requirements=Object.entries(rule.requiredCounters??{});
 const counterProgress=requirements.length?requirements.reduce((sum,[key,required])=>sum+Math.min(1,(state.counters[key]??0)/required),0)/requirements.length:1;
 const achievementProgress=rule.requiredAchievements?.length?rule.requiredAchievements.filter(a=>state.achievements.includes(a)).length/rule.requiredAchievements.length:1;
 const convictionProgress=rule.requiredConviction?Math.min(1,(state.convictions[rule.requiredConviction.key]??0)/rule.requiredConviction.min):1;
 return Math.round(Math.min(counterProgress,achievementProgress,convictionProgress)*100);
}

export function inspectRolePressure(state:RoleState):RolePressure[]{
 return ROLE_EVOLUTIONS.filter(r=>r.from===state.core||r.from===state.path||r.from===state.trueRole).map((rule)=>({role:rule.to,progress:progressFor(state,rule),missing:[...Object.entries(rule.requiredCounters??{}).filter(([k,v])=>(state.counters[k]??0)<v).map(([k,v])=>`${k}: ${(state.counters[k]??0)}/${v}`),...(rule.requiredAchievements??[]).filter(a=>!state.achievements.includes(a)).map(a=>`achievement: ${a}`),...(rule.requiredConviction && (state.convictions[rule.requiredConviction.key]??0)<rule.requiredConviction.min?[`conviction: ${rule.requiredConviction.key} ${state.convictions[rule.requiredConviction.key]??0}/${rule.requiredConviction.min}`]:[])],hidden:rule.to.includes('Truth')||rule.to.includes('Kingmaker'),ready:false}));
}

export function getReadyEvolutions(state:RoleState){return discoverEvolutions(state);}
