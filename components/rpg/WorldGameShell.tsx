'use client';

import { useState } from 'react';
import { DungeonRoomPanel } from './DungeonRoomPanel';
import { NPCDialogueGatedPanel } from './NPCDialogueGatedPanel';
import { NPCShopPanel, type NPCShopEntry } from './NPCShopPanel';
import { ForgePanel } from './ForgePanel';
import { DungeonCombatHost } from './DungeonCombatHost';
import type { DungeonAction } from '../../lib/rpg/dungeon-interaction-router';
import type { GameRuntimeState } from '../../lib/rpg/game-runtime-state';
import { patchGameRuntimeState } from '../../lib/rpg/game-runtime-state';
import { beginInteraction, closeInteraction } from '../../lib/rpg/world-interaction-controller';

export interface WorldGameShellProps {
  runtime: GameRuntimeState;
  onRuntimeChange: (runtime: GameRuntimeState) => void;
  npcNode?: Parameters<typeof NPCDialogueGatedPanel>[0]['node'];
  shopEntries?: NPCShopEntry[];
  forgeRecipe?: Parameters<typeof ForgePanel>[0]['recipe'];
}

export function WorldGameShell({ runtime, onRuntimeChange, npcNode, shopEntries = [], forgeRecipe }: WorldGameShellProps) {
  const [message, setMessage] = useState('Explore the room.');
  const mode = runtime.interaction.mode;
  const activeTarget = runtime.interaction.targetId;
  const lastAction = runtime.interaction.action;

  function route(action: DungeonAction) {
    const next = patchGameRuntimeState(runtime, {
      interaction: beginInteraction(runtime.interaction, action),
    });
    onRuntimeChange(next);
    setMessage(`${action.type} opened.`);
  }

  function backToWorld() {
    const next = patchGameRuntimeState(runtime, {
      interaction: closeInteraction(runtime.interaction),
    });
    onRuntimeChange(next);
    setMessage('Back to exploration.');
  }

  return (
    <section aria-label="World game shell" className="space-y-4">
      {mode === 'explore' && (
        <DungeonRoomPanel
          seed={runtime.dungeon.room.seed}
          onInteract={(target) => route(target)}
          onEnemyEncounter={(enemy) => route({ type: 'combat', targetId: enemy.id, monsterId: enemy.monsterId })}
        />
      )}

      {mode === 'dialogue' && npcNode && (
        <NPCDialogueGatedPanel
          node={npcNode}
          context={{
            level: runtime.game.character.level,
            inventoryItemIds: runtime.inventory.map((item) => item.id),
            questStates: {},
            worldFlags: runtime.quests.worldFlags ?? {},
            reputation: runtime.game.character.reputation,
          }}
          onChoose={(choiceId) => setMessage(`Dialogue choice: ${choiceId}`)}
          onClose={backToWorld}
        />
      )}

      {mode === 'shop' && (
        <NPCShopPanel
          npcName={activeTarget ?? 'Merchant'}
          gold={runtime.game.character.gold}
          entries={shopEntries}
          onBuy={(itemId) => setMessage(`Purchase requested: ${itemId}`)}
          onClose={backToWorld}
        />
      )}

      {mode === 'forge' && forgeRecipe && (
        <ForgePanel
          recipe={forgeRecipe}
          gold={runtime.game.character.gold}
          materials={Object.fromEntries(runtime.inventory.filter((item) => item.category === 'Material').map((item) => [item.id, 1]))}
          playerRank={runtime.game.character.level}
          onForge={(result) => setMessage(result.ok ? `Forged ${result.outputItemId}` : `Forge failed: ${result.reason ?? 'unknown'}`)}
        />
      )}

      {mode === 'combat' && lastAction?.type === 'combat' && (
        <DungeonCombatHost
          monsterId={lastAction.monsterId}
          onClose={backToWorld}
          game={runtime.game}
        />
      )}

      {mode === 'chest' && (
        <section className="rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="text-sm font-semibold">Chest</div>
          <p className="mt-2 text-xs opacity-60">Reward resolution is ready for the loot transaction layer.</p>
          <button type="button" onClick={backToWorld} className="mt-3 rounded-lg border border-white/10 px-3 py-2 text-xs">Take Reward</button>
        </section>
      )}

      {mode === 'exit' && (
        <section className="rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="text-sm font-semibold">Dungeon Exit</div>
          <p className="mt-2 text-xs opacity-60">Return to the world map?</p>
          <button type="button" onClick={backToWorld} className="mt-3 rounded-lg border border-white/10 px-3 py-2 text-xs">Return</button>
        </section>
      )}

      <div className="text-xs opacity-50">{message}</div>
    </section>
  );
}
