'use client';

import { useState } from 'react';
import type { ForgeRecipe, ForgeResult } from '@/lib/rpg/forging-engine';

export interface ForgePanelProps {
  recipe: ForgeRecipe;
  gold: number;
  materials: Record<string, number>;
  playerRank: number;
  onForge(result: ForgeResult): void;
}

export function ForgePanel({ recipe, gold, materials, playerRank, onForge }: ForgePanelProps) {
  const [lastResult, setLastResult] = useState<ForgeResult | null>(null);
  const canAffordMaterials = recipe.materials.every((m) => (materials[m.materialId] ?? 0) >= m.quantity);
  const canForge = canAffordMaterials && gold >= (recipe.goldCost ?? 0) && playerRank >= (recipe.minRank ?? 0);
  return (
    <section aria-label="Forge" className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{recipe.operation === 'craft' ? 'Craft' : recipe.operation === 'upgrade' ? 'Upgrade' : 'Reroll Affix'}</div>
          <div className="text-xs opacity-60">{recipe.outputItemId}</div>
        </div>
        <div className="text-xs opacity-70">Gold {gold}</div>
      </div>
      <div className="mt-4 space-y-1 text-xs opacity-80">
        {recipe.materials.map((m) => <div key={m.materialId} className="flex justify-between"><span>{m.materialId}</span><span>{materials[m.materialId] ?? 0} / {m.quantity}</span></div>)}
      </div>
      <div className="mt-3 text-xs opacity-60">Forge cost: {recipe.goldCost ?? 0} · Rank: {recipe.minRank ?? 0}</div>
      <button
        type="button"
        disabled={!canForge}
        onClick={() => {
          const result: ForgeResult = {
            ok: true,
            gold: gold - (recipe.goldCost ?? 0),
            goldSpent: recipe.goldCost ?? 0,
            materials: Object.fromEntries(Object.entries(materials).map(([id, qty]) => {
              const required = recipe.materials.find((m) => m.materialId === id)?.quantity ?? 0;
              return [id, qty - required];
            })),
            outputItemId: recipe.outputItemId,
            transactionKey: `forge:${recipe.id}:ui`,
            quality: 'standard',
          };
          setLastResult(result);
          onForge(result);
        }}
        className="mt-4 rounded-lg border border-white/15 px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
      >Forge</button>
      {lastResult && <div className="mt-3 text-xs">{lastResult.ok ? `Crafted ${lastResult.outputItemId} · ${lastResult.quality}` : lastResult.reason}</div>}
    </section>
  );
}
