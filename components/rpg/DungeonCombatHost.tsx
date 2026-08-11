'use client';

import type { GameState } from '@/lib/rpg/types';
import { TacticalArenaController } from './TacticalArenaController';

export interface DungeonCombatHostProps {
  game: GameState;
  action: Parameters<typeof TacticalArenaController>[0]['action'];
  bossOrigin: { x: number; y: number };
  playerPosition: { x: number; y: number };
}

export function DungeonCombatHost({ game, action, bossOrigin, playerPosition }: DungeonCombatHostProps) {
  return (
    <section aria-label="Dungeon combat" className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <TacticalArenaController
        game={game}
        action={action}
        bossOrigin={bossOrigin}
        playerPosition={playerPosition}
      />
    </section>
  );
}
