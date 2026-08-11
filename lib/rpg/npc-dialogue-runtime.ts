import type { QuestWorldPersistence } from './quest-world-persistence';
import { applyQuestChoice, type QuestChoice, type QuestChoiceContext } from './quest-choice-resolver';

export interface DialogueNode { id:string; speaker:string; text:string; choices:QuestChoice[]; }
export interface DialogueState { npcId:string; nodeId:string; history:string[]; }

export function beginDialogue(npcId:string,node:DialogueNode):DialogueState {
 return {npcId,nodeId:node.id,history:[]};
}

export function chooseDialogue(
 state:DialogueState,
 choice:QuestChoice,
 context:QuestChoiceContext,
 world:QuestWorldPersistence,
):{state:DialogueState; world:QuestWorldPersistence; nextNodeId?:string} {
 const resolved=applyQuestChoice(choice,context,world);
 return {state:{...state,history:[...state.history,choice.id],nodeId:choice.nextNodeId??state.nodeId},world:resolved.world,nextNodeId:choice.nextNodeId};
}
