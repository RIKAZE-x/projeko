export type NpcMood='Calm'|'Busy'|'Suspicious'|'Friendly'|'Hostile';
export interface NPCDefinition{id:string;name:string;title:string;location:string;factionId:string;personality:string;schedule:{from:number;to:number;location:string}[];dialogue:string[];questIds:string[];}
export interface QuestBoardEntry{id:string;title:string;summary:string;factionId:string;minReputation?:number;requiredFlags?:string[];level:number;rewardGold:number;rewardXp:number;target:string;}
export interface DialogueResult{text:string; mood:NpcMood; unlockFlags:string[]; reputationDelta:number;}

export const NPCS:NPCDefinition[]=[
 {id:'captain-elian',name:'Elian Voss',title:'Guild Captain',location:'Valerion',factionId:'adventurer-guild',personality:'disciplined but protective',schedule:[{from:6,to:14,location:'guild-hall'},{from:14,to:22,location:'training-yard'}],dialogue:['The roads are getting worse. Tell me what you found beyond the gate.','A guild badge is trust. Do not spend it lightly.'],questIds:['road-watch','ashen-investigation']},
 {id:'smith-mara',name:'Mara Ironhand',title:'Master Smith',location:'Valerion',factionId:'blacksmiths',personality:'blunt, proud, curious about rare materials',schedule:[{from:7,to:19,location:'forge'},{from:19,to:22,location:'tavern'}],dialogue:['Bring me better metal and I can make you something that survives the deep.','Mithril prices are rising again. Someone is stockpiling it.'],questIds:['mithril-shortage']},
 {id:'warden-nyx',name:'Nyx Arclight',title:'Veil Warden',location:'Emberfall',factionId:'veil-wardens',personality:'calm, secretive, highly observant',schedule:[{from:0,to:24,location:'ash-bell-shrine'}],dialogue:['Do not touch the bell until you understand what answers from beneath it.','The Veil notices repeated choices. That is why history matters.'],questIds:['ash-bell-seal']},
];

export const QUEST_BOARD:QuestBoardEntry[]=[
 {id:'road-watch',title:'Road Watch',summary:'Clear threats along the Valerion–Crossroads route.',factionId:'adventurer-guild',minReputation:0,level:5,rewardGold:180,rewardXp:260,target:'crossroads-route'},
 {id:'ashen-investigation',title:'Ashen Investigation',summary:'Investigate disturbances around Emberfall.',factionId:'adventurer-guild',minReputation:20,requiredFlags:['ash-chamber'],level:15,rewardGold:540,rewardXp:900,target:'ash-bell'},
 {id:'mithril-shortage',title:'Mithril Shortage',summary:'Trace the source of the regional mithril shortage.',factionId:'blacksmiths',minReputation:10,level:12,rewardGold:420,rewardXp:700,target:'ironwall-market'},
 {id:'ash-bell-seal',title:'Seal the Ashen Bell',summary:'Stabilize the bell before its resonance reaches the region.',factionId:'veil-wardens',minReputation:25,requiredFlags:['veil-response'],level:22,rewardGold:1200,rewardXp:1800,target:'ash-bell'},
];

export function getNpc(id:string){return NPCS.find(n=>n.id===id);}
export function availableQuests(reputation:Record<string,number>,flags:Record<string,boolean|string|number>){return QUEST_BOARD.filter(q=>(reputation[q.factionId]??0)>=(q.minReputation??-999)&&(!q.requiredFlags||q.requiredFlags.every(f=>Boolean(flags[f]))));}
export function talkToNpc(npc:NPCDefinition,reputation:Record<string,number>,flags:Record<string,boolean|string|number>,hour:number):DialogueResult{
 const standing=reputation[npc.factionId]??0; const mood: NpcMood=standing>=60?'Friendly':standing<0?'Hostile':standing<20?'Suspicious':'Calm';
 const schedule=npc.schedule.find(s=>hour>=s.from&&hour<s.to); const suffix=schedule?` You find ${npc.name} at the ${schedule.location}.`:' They are not where you expected.';
 const text=(npc.dialogue[Math.abs(hour)%npc.dialogue.length]??'...')+suffix;
 const unlockFlags=npc.id==='warden-nyx'&&flags['veil-response']?['warden-trust']:[];
 return {text,mood,unlockFlags,reputationDelta:standing<20?1:0};
}
