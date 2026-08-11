import type { DungeonAction } from './dungeon-interaction-router';

export type WorldMode = 'explore' | DungeonAction['type'];

export interface WorldInteractionSession {
  seed: number;
  mode: WorldMode;
  targetId?: string;
  monsterId?: string;
  history: DungeonAction[];
}

export function createDungeonInteractionSession(seed: number): WorldInteractionSession {
  return { seed, mode: 'explore', history: [] };
}

export function beginInteraction(session: WorldInteractionSession, action: DungeonAction): WorldInteractionSession {
  return {
    ...session,
    mode: action.type,
    targetId: action.targetId,
    monsterId: action.type === 'combat' ? action.monsterId : undefined,
    history: [...session.history, action].slice(-20),
  };
}

export function closeInteraction(session: WorldInteractionSession): WorldInteractionSession {
  return { ...session, mode: 'explore', targetId: undefined, monsterId: undefined };
}
