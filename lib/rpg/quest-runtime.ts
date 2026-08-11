export type QuestStatus = 'locked' | 'active' | 'completed' | 'failed';

export interface QuestObjective {
  id: string;
  type: 'kill' | 'collect' | 'talk' | 'discover' | 'travel' | 'interact';
  targetId: string;
  required: number;
}

export interface QuestDefinition {
  id: string;
  title: string;
  objectives: QuestObjective[];
  branches?: Record<string, { nextQuestId?: string; worldFlags?: Record<string, boolean> }>;
}

export interface QuestRuntimeState {
  status: QuestStatus;
  progress: Record<string, number>;
  branch?: string;
}

export function startQuest(): QuestRuntimeState {
  return { status: 'active', progress: {} };
}

export function applyObjectiveEvent(
  definition: QuestDefinition,
  state: QuestRuntimeState,
  event: { type: QuestObjective['type']; targetId: string; amount?: number },
): QuestRuntimeState {
  if (state.status !== 'active') return state;
  const objective = definition.objectives.find((item) => item.type === event.type && item.targetId === event.targetId);
  if (!objective) return state;
  const current = state.progress[objective.id] ?? 0;
  const next = Math.min(objective.required, current + Math.max(1, event.amount ?? 1));
  const progress = { ...state.progress, [objective.id]: next };
  const complete = definition.objectives.every((item) => (progress[item.id] ?? 0) >= item.required);
  return { ...state, progress, status: complete ? 'completed' : 'active' };
}

export function chooseQuestBranch(
  definition: QuestDefinition,
  state: QuestRuntimeState,
  branch: string,
): QuestRuntimeState {
  if (!definition.branches?.[branch]) return state;
  return { ...state, branch };
}
