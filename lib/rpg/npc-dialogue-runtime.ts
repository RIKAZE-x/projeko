import type { QuestDefinition, QuestRuntimeState } from './quest-runtime';
import { chooseQuestBranch, resolveQuestChoice, type QuestChoiceReaction } from './quest-choice-resolver';

export interface DialogueChoice { id:string; text:string; nextNodeId?:string; }
export interface DialogueNode { id:string; speaker:string; text:string; choices:DialogueChoice[]; }
export interface DialogueState { npcId:string; nodeId:string; history:string[]; }

export function beginDialogue(npcId:string,node:DialogueNode):DialogueState {
 return {npcId,nodeId:node.id,history:[]};
}

export function chooseDialogue(
 state:DialogueState,
 choice:DialogueChoice,
 quest:QuestDefinition,
 questState:QuestRuntimeState,
):{state:DialogueState; questState:QuestRuntimeState; reaction:QuestChoiceReaction} {
 const nextState=chooseQuestBranch(quest,questState,choice.id);
 const reaction=resolveQuestChoice(quest,nextState,choice.id);
 return {
  state:{...state,history:[...state.history,choice.id],nodeId:choice.nextNodeId??state.nodeId},
  questState:nextState,
  reaction,
 };
}
