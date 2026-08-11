'use client';

import { useMemo, useState } from 'react';
import { createDungeonRoomRuntime, interactAt, enemyAt, movePlayer, type DungeonRoomRuntime, type GridPos } from '@/lib/rpg/dungeon-room-runtime';

export interface DungeonRoomPanelProps {
  seed: number;
  onInteract?: (target: ReturnType<typeof interactAt>) => void;
  onEnemyEncounter?: (enemy: ReturnType<typeof enemyAt>) => void;
}

function delta(from: GridPos, to: GridPos): GridPos {
  return { x: to.x - from.x, y: to.y - from.y };
}

export function DungeonRoomPanel({ seed, onInteract, onEnemyEncounter }: DungeonRoomPanelProps) {
  const [state, setState] = useState<DungeonRoomRuntime>(() => createDungeonRoomRuntime(seed));
  const target = useMemo(() => interactAt(state), [state]);
  const enemy = useMemo(() => enemyAt(state), [state]);

  function move(to: GridPos) {
    const next = movePlayer(state, delta(state.player, to));
    setState(next);
  }

  function step(dx: number, dy: number) {
    setState((current) => movePlayer(current, { x: dx, y: dy }));
  }

  return (
    <section aria-label="Dungeon room" className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest opacity-50">Dungeon Room</div>
          <div className="text-sm font-semibold">{state.room.id}</div>
        </div>
        <div className="text-xs opacity-60">Pos {state.player.x},{state.player.y}</div>
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${state.room.width}, minmax(0, 1fr))` }}>
        {state.room.tiles.map((tile, index) => {
          const x = index % state.room.width;
          const y = Math.floor(index / state.room.width);
          const occupied = state.player.x === x && state.player.y === y;
          const point = state.room.interactables.find((entry) => entry.pos.x === x && entry.pos.y === y);
          const enemyHere = state.room.enemies.find((entry) => !entry.defeated && entry.pos.x === x && entry.pos.y === y);
          const glyph = occupied ? '@' : enemyHere ? 'E' : point ? point.kind === 'npc' ? 'N' : point.kind === 'shop' ? 'S' : point.kind === 'forge' ? 'F' : point.kind === 'chest' ? 'C' : '>' : tile === 'wall' ? '#' : tile === 'door' ? 'D' : tile === 'stairs' ? '>' : '.';
          const walkable = tile !== 'wall' && tile !== 'water';
          return <button key={`${x}:${y}`} type="button" disabled={!walkable} onClick={() => move({ x, y })} className={`aspect-square rounded-md border text-xs ${occupied ? 'border-white/50 bg-white/15' : 'border-white/5 bg-white/[0.03]'} ${walkable ? 'hover:bg-white/10' : 'cursor-not-allowed opacity-40'}`} aria-label={`Tile ${x},${y}`}>{glyph}</button>;
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => step(0, -1)} className="rounded-lg border border-white/10 px-3 py-2 text-xs">↑</button>
        <button type="button" onClick={() => step(-1, 0)} className="rounded-lg border border-white/10 px-3 py-2 text-xs">←</button>
        <button type="button" onClick={() => step(1, 0)} className="rounded-lg border border-white/10 px-3 py-2 text-xs">→</button>
        <button type="button" onClick={() => step(0, 1)} className="rounded-lg border border-white/10 px-3 py-2 text-xs">↓</button>
      </div>

      {(target || enemy) && <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
        {target && <div className="flex items-center justify-between gap-3"><span>{target.label}</span><button type="button" onClick={() => onInteract?.(target)} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs">Interact</button></div>}
        {enemy && <div className="flex items-center justify-between gap-3"><span>{enemy.monsterId}</span><button type="button" onClick={() => onEnemyEncounter?.(enemy)} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs">Engage</button></div>}
      </div>}
    </section>
  );
}
