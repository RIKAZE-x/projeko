export type BossPhase = 1|2|3;
export type TelegraphShape = 'single'|'line'|'cross'|'ring'|'cone';
export interface CombatTelegraph { id:string; name:string; shape:TelegraphShape; warningTurns:number; damage:number; status?:'burn'|'bleed'|'stun'; phase:BossPhase; }
export interface BossCombatState { phase:BossPhase; turn:number; telegraph?:CombatTelegraph; enrage:boolean; }

const TELEGRAPHS:CombatTelegraph[]=[
 {id:'ember-line',name:'Ember Line',shape:'line',warningTurns:1,damage:12,status:'burn',phase:1},
 {id:'void-cross',name:'Void Cross',shape:'cross',warningTurns:1,damage:18,status:'bleed',phase:2},
 {id:'cataclysm-ring',name:'Cataclysm Ring',shape:'ring',warningTurns:2,damage:28,status:'stun',phase:3},
];
export function phaseForHp(hp:number,maxHp:number):BossPhase { const ratio=hp/Math.max(1,maxHp); return ratio<=0.33?3:ratio<=0.66?2:1; }
export function nextBossTurn(state:BossCombatState,hp:number,maxHp:number):BossCombatState { const phase=phaseForHp(hp,maxHp); const candidates=TELEGRAPHS.filter(x=>x.phase<=phase); const telegraph=candidates[(state.turn+candidates.length)%candidates.length]; return {phase,turn:state.turn+1,telegraph,enrage:phase===3}; }
export function resolveTelegraph(state:BossCombatState){ return state.telegraph?{damage:state.telegraph.damage,status:state.telegraph.status}: {damage:0,status:undefined}; }
