'use client';

import { TacticalArenaController } from './TacticalArenaController';

export interface DungeonCombatHostProps {
  monsterId: string;
  onVictory?: () => void;
  onDefeat?: () => void;
  onClose?: () => void;
}

export function DungeonCombatHost({ monsterId, onVictory, onDefeat, onClose }: DungeonCombatHostProps) {
  return (
    <section aria-label="Dungeon combat" className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="mb-3 text-xs uppercase tracking-widest opacity-50">Encounter</div>
      <div className="mb-3 text-sm font-semibold">{monsterId}</div>
      <TacticalArenaController onVictory={onVictory} onDefeat={onDefeat} />
      {onClose && <button type="button" onClick={onClose} className="mt-3 text-xs opacity-60 hover:opacity-100">Retreat</button>}
    </section>
  );
}
