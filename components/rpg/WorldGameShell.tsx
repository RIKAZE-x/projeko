'use client';

import { useMemo, useState } from 'react';
import { DungeonRoomPanel } from './DungeonRoomPanel';
import { NPCDialogueGatedPanel } from './NPCDialogueGatedPanel';
import { NPCShopPanel, type NPCShopEntry } from './NPCShopPanel';
import { ForgePanel } from './ForgePanel';
import { DungeonCombatHost } from './DungeonCombatHost';
import { createDungeonInteractionSession, closeInteraction, beginInteraction, type WorldInteractionSession } from '../../lib/rpg/world-interaction-controller';
import type { DungeonAction } from '../../lib/rpg/dungeon-interaction-router';

export interface WorldGameShellProps {
  seed: number;
  npcNode?: Parameters<typeof NPCDialogueGatedPanel>[0]['node'];
  shopEntries?: NPCShopEntry[];
  forgeRecipe?: Parameters<typeof ForgePanel>[0]['recipe'];
}

export function WorldGameShell({ seed, npcNode, shopEntries = [], forgeRecipe }: WorldGameShellProps) {
  const [session, setSession] = useState<WorldInteractionSession>(() => createDungeonInteractionSession(seed));
  const [lastAction, setLastAction] = useState<DungeonAction | null>(null);
  const [message, setMessage] = useState('Explore the room.');

  const mode = session.mode;
  const activeTarget = session.targetId;

  function route(action: DungeonAction) {
    setLastAction(action);
    setSession((current) => beginInteraction(current, action));
    setMessage(`${action.type} opened.`);
  }

  function backToWorld() {
    setSession(closeInteraction(session));
    setMessage('Back to exploration.');
  }

  return (
    <section aria-label="World game shell" className="space-y-4">
      {mode === 'explore' && (
        <DungeonRoomPanel
          seed={seed}
          onInteract={(target) => route(target)}
          onEnemyEncounter={(enemy) => route({ type: 'combat', targetId: enemy.id, monsterId: enemy.monsterId })}
        />
      )}

      {mode === 'dialogue' && npcNode && (
        <NPCDialogueGatedPanel
          node={npcNode}
          context={{ level: 1, inventoryItemIds: [], questStates: {}, worldFlags: {}, reputation: {} }}
          onChoose={(choiceId) => setMessage(`Dialogue choice: ${choiceId}`)}
          onClose={backToWorld}
        />
      )}

      {mode === 'shop' && (
        <NPCShopPanel npcName={activeTarget ?? 'Merchant'} gold={0} entries={shopEntries} onBuy={(itemId) => setMessage(`Purchase requested: ${itemId}`)} onClose={backToWorld} />
      )}

      {mode === 'forge' && forgeRecipe && (
        <ForgePanel recipe={forgeRecipe} gold={0} materials={{}} playerRank={0} onForge={(result) => setMessage(result.ok ? `Forged ${result.outputItemId}` : `Forge failed: ${result.reason ?? 'unknown'}`)} />
      )}

      {mode === 'combat' && lastAction?.type === 'combat' && (
        <DungeonCombatHost monsterId={lastAction.monsterId} onClose={backToWorld} />
      )}

      {mode === 'chest' && <section className="rounded-xl border border-white/10 bg-black/30 p-4"><div className="text-sm font-semibold">Chest</div><p className="mt-2 text-xs opacity-60">Reward resolution is ready for the loot transaction layer.</p><button type="button" onClick={backToWorld} className="mt-3 rounded-lg border border-white/10 px-3 py-2 text-xs">Take Reward</button></section>}

      {mode === 'exit' && <section className="rounded-xl border border-white/10 bg-black/30 p-4"><div className="text-sm font-semibold">Dungeon Exit</div><p className="mt-2 text-xs opacity-60">Return to the world map?</p><button type="button" onClick={backToWorld} className="mt-3 rounded-lg border border-white/10 px-3 py-2 text-xs">Return</button></section>}

      <div className="text-xs opacity-50">{message}</div>
    </section>
  );
}
