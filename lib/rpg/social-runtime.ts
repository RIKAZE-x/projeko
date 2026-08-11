import type { QuestState } from './quest-engine';

export interface SocialState {
  quest: QuestState;
  npcFlags: Record<string, boolean>;
  dialogueHistory: string[];
}

export function createSocialState(): SocialState {
  return { quest:{active:[],completed:[],failed:[],flags:{},reputation:{}}, npcFlags:{}, dialogueHistory:[] };
}

export function acceptQuest(state:SocialState, questId:string):SocialState {
  if(state.quest.completed.includes(questId)||state.quest.failed.includes(questId)) return state;
  return {...state,quest:{...state.quest,active:state.quest.active.includes(questId)?state.quest.active:[...state.quest.active,questId]}};
}

export function recordDialogue(state:SocialState,npcId:string,dialogueId:string):SocialState {
  return {...state,npcFlags:{...state.npcFlags,[`${npcId}:${dialogueId}`]:true},dialogueHistory:[...state.dialogueHistory,`${npcId}:${dialogueId}`].slice(-100)};
}

export function applyReputation(state:SocialState,faction:string,delta:number):SocialState {
  const reputation={...state.quest.reputation,[faction]:Math.max(-100,Math.min(100,(state.quest.reputation[faction]??0)+delta))};
  return {...state,quest:{...state.quest,reputation}};
}
