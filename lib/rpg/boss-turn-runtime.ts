import type { BossCombatState } from './boss-combat-engine';
import { nextBossTurn, resolveTelegraph } from './boss-combat-engine';
import { resolveBossAoE, type GridPoint } from './boss-aoe';

export interface BossTurnResult {
  state: BossCombatState;
  hit: boolean;
  damage: number;
  status?: 'burn'|'bleed'|'stun';
}

export function beginBossTurn(state: BossCombatState, hp: number, maxHp: number): BossCombatState {
  return nextBossTurn(state, hp, maxHp);
}

export function resolveBossTurn(state: BossCombatState, player: GridPoint, origin: GridPoint): BossTurnResult {
  const telegraph = state.telegraph;
  if (!telegraph) return {state, hit:false, damage:0};
  const result = resolveBossAoE(telegraph.shape, origin, player);
  const resolved = resolveTelegraph(state);
  return {state:{...state,telegraph:undefined},hit:result.hit,damage:result.hit?resolved.damage:0,status:result.hit?resolved.status:undefined};
}
