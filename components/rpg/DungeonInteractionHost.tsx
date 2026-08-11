'use client';

import { useState } from 'react';
import type { DungeonAction } from '@/lib/rpg/dungeon-interaction-router';
import type { DialogueNode } from '@/lib/rpg/npc-dialogue-runtime';
import type { DialogueGateContext, DialogueRequirements } from '@/lib/rpg/npc-dialogue-gating';
import { NPCDialogueGatedPanel } from './NPCDialogueGatedPanel';
import { NPCShopPanel, type NPCShopEntry } from './NPCShopPanel';
import { ForgePanel } from './ForgePanel';
import type { ForgeRecipe, ForgeResult } from '@/lib/rpg/forging-engine';

export type DungeonInteractionView =
  | { type: 'none' }
  | { type: 'npc'; node: DialogueNode; requirements?: Record<string, DialogueRequirements>; context: DialogueGateContext }
  | { type: 'shop'; npcName: string; gold: number; entries: NPCShopEntry[] }
  | { type: 'forge'; recipe: ForgeRecipe; gold: number; materials: Record<string, number>; playerRank: number }
  | { type: 'chest'; chestId: string; rewardText: string; claimed: boolean }
  | { type: 'exit'; targetId: string };

export interface DungeonInteractionHostProps {
  action: DungeonAction | null;
  view: DungeonInteractionView;
  onDialogueChoice?: (choiceId: string) => void;
  onBuy?: (itemId: string) => void;
  onForge?: (result: ForgeResult) => void;
  onClaimChest?: (chestId: string) => void;
  onExit?: (targetId: string) => void;
  onCombat?: (monsterId: string) => void;
  onClose?: () => void;
}

export function DungeonInteractionHost({
  action,
  view,
  onDialogueChoice,
  onBuy,
  onForge,
  onClaimChest,
  onExit,
  onCombat,
  onClose,
}: DungeonInteractionHostProps) {
  const [closed, setClosed] = useState(false);
  if (!action || closed || view.type === 'none') return null;

  const close = () => {
    setClosed(true);
    onClose?.();
  };

  switch (view.type) {
    case 'npc':
      return <NPCDialogueGatedPanel node={view.node} choiceRequirements={view.requirements} context={view.context} onChoose={(choiceId) => onDialogueChoice?.(choiceId)} onClose={close} />;
    case 'shop':
      return <NPCShopPanel npcName={view.npcName} gold={view.gold} entries={view.entries} onBuy={(itemId) => onBuy?.(itemId)} onClose={close} />;
    case 'forge':
      return <ForgePanel recipe={view.recipe} gold={view.gold} materials={view.materials} playerRank={view.playerRank} onForge={(result) => onForge?.(result)} />;
    case 'chest':
      return (
        <section aria-label="Chest" className="rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="text-xs uppercase tracking-widest opacity-50">Treasure</div>
          <div className="mt-1 text-sm font-semibold">Chest {view.chestId}</div>
          <div className="mt-3 text-sm opacity-80">{view.claimed ? 'Already claimed.' : view.rewardText}</div>
          {!view.claimed && <button type="button" onClick={() => onClaimChest?.(view.chestId)} className="mt-4 rounded-lg border border-white/15 px-3 py-2 text-xs">Open Chest</button>}
          <button type="button" onClick={close} className="mt-3 block text-xs opacity-60">Close</button>
        </section>
      );
    case 'exit':
      return (
        <section aria-label="Dungeon exit" className="rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="text-sm font-semibold">Leave Dungeon</div>
          <div className="mt-2 text-xs opacity-60">Route: {view.targetId}</div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => onExit?.(view.targetId)} className="rounded-lg border border-white/15 px-3 py-2 text-xs">Continue</button>
            <button type="button" onClick={close} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Stay</button>
          </div>
        </section>
      );
    default:
      return null;
  }
}
