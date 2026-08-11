import type { GameState } from './types';

export type BossOutcome='dodged'|'hit'|'defeated-player';

export function bossOutcome(game:GameState,hit:boolean):BossOutcome {
  if(game.character.hp<=0) return 'defeated-player';
  return hit?'hit':'dodged';
}

export function appendBossOutcome(game:GameState,outcome:BossOutcome,damage=0):GameState {
  const line=outcome==='dodged'?'Dodged the boss telegraph.':outcome==='hit'?`Boss damage: ${damage}.`:'The expedition fell in the dungeon.';
  return {...game,logs:[line,...game.logs].slice(0,50)};
}
