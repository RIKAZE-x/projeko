import type { Character } from './types';
export type Tactic='Aggressive'|'Defensive'|'Support'|'Balanced';
export interface PartyDecision{memberId:string;action:'attack'|'skill'|'guard'|'support';target:'enemy'|'ally';reason:string;}
export function decidePartyAction(member:Character,tactic:Tactic,party:Character[],enemyThreat:number):PartyDecision{
 const ally=party.filter(p=>p.id!==member.id).sort((a,b)=>a.attributes.VIT-b.attributes.VIT)[0];
 if(tactic==='Support' && ally && ally.attributes.VIT<25 && member.attributes.MAG>30)return{memberId:member.id,action:'support',target:'ally',reason:'Lowest-vitality ally needs protection'};
 if(tactic==='Defensive' && enemyThreat>60)return{memberId:member.id,action:'guard',target:'enemy',reason:'Threat exceeds defensive threshold'};
 if(member.skills.length>0 && member.attributes.MAG>25)return{memberId:member.id,action:'skill',target:'enemy',reason:'Skill available with sufficient magical aptitude'};
 return{memberId:member.id,action:'attack',target:'enemy',reason:tactic==='Aggressive'?'Maintain offensive pressure':'Use basic attack'};
}
