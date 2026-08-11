'use client';

import { useMemo } from 'react';

export interface NPCShopEntry {
  id: string;
  name: string;
  basePrice: number;
  finalPrice: number;
  stock: number;
  unlocked: boolean;
  reason?: string;
}

export interface NPCShopPanelProps {
  npcName: string;
  gold: number;
  entries: NPCShopEntry[];
  onBuy: (itemId: string) => void;
  onClose?: () => void;
}

export function NPCShopPanel({ npcName, gold, entries, onBuy, onClose }: NPCShopPanelProps) {
  const visible = useMemo(() => entries, [entries]);
  return (
    <section aria-label="NPC shop" className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{npcName}'s Shop</div>
          <div className="text-xs opacity-60">Dynamic prices & stock</div>
        </div>
        <div className="text-sm tabular-nums">Gold {gold}</div>
      </div>
      <div className="space-y-2">
        {visible.map((entry) => {
          const disabled = !entry.unlocked || entry.stock <= 0 || gold < entry.finalPrice;
          return (
            <div key={entry.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{entry.name}</div>
                  <div className="text-xs opacity-60">
                    Stock {entry.stock} · {entry.finalPrice}g
                    {entry.finalPrice !== entry.basePrice ? ` · base ${entry.basePrice}g` : ''}
                  </div>
                  {!entry.unlocked && <div className="mt-1 text-xs opacity-50">Locked: {entry.reason ?? 'Requirements not met'}</div>}
                </div>
                <button type="button" disabled={disabled} onClick={() => onBuy(entry.id)} className="rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">
                  {entry.stock <= 0 ? 'Out of stock' : !entry.unlocked ? 'Locked' : gold < entry.finalPrice ? 'Need Gold' : 'Buy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {onClose && <button type="button" onClick={onClose} className="mt-4 text-xs opacity-60 hover:opacity-100">Close</button>}
    </section>
  );
}
