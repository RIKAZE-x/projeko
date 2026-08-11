export type NPCMemoryKind = 'dialogue' | 'gift' | 'quest' | 'combat' | 'world';

export interface NPCMemoryEvent {
  id: string;
  npcId: string;
  kind: NPCMemoryKind;
  summary: string;
  affinityDelta: number;
  tags: string[];
  timestamp: string;
}

export interface NPCMemoryState {
  events: NPCMemoryEvent[];
}

export const EMPTY_NPC_MEMORY: NPCMemoryState = { events: [] };

export function rememberNPCEvent(
  state: NPCMemoryState,
  event: NPCMemoryEvent,
): NPCMemoryState {
  if (state.events.some((item) => item.id === event.id)) return state;
  return { events: [...state.events, event] };
}

export function recentNPCMemories(
  state: NPCMemoryState,
  npcId: string,
  limit = 5,
): NPCMemoryEvent[] {
  return state.events.filter((event) => event.npcId === npcId).slice(-limit).reverse();
}
