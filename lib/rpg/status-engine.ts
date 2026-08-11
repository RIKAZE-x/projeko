export type StatusId='Burn'|'Bleed'|'Poison'|'Stun'|'Slow'|'Silence'|'Fear'|'Regeneration'|'Barrier';
export interface StatusEffect{id:StatusId;duration:number;stacks:number;power:number;source:string;}
export function applyStatus(list:StatusEffect[], effect:StatusEffect){const existing=list.find(s=>s.id===effect.id);if(!existing)return[...list,effect];return list.map(s=>s.id===effect.id?{...s,duration:Math.max(s.duration,effect.duration),stacks:Math.min(10,s.stacks+effect.stacks),power:Math.max(s.power,effect.power)}:s);}
export function tickStatuses(list:StatusEffect[]){return list.map(s=>({...s,duration:s.duration-1})).filter(s=>s.duration>0);}
export function statusDamage(effect:StatusEffect){if(['Burn','Bleed','Poison'].includes(effect.id))return effect.power*effect.stacks;return 0;}
