'use client';

export interface NPCRelationshipPanelProps {
  npcName: string;
  affinity: number;
  tier: string;
  recentMemories?: string[];
  onGift?: () => void;
}

export function NPCRelationshipPanel({
  npcName,
  affinity,
  tier,
  recentMemories = [],
  onGift,
}: NPCRelationshipPanelProps) {
  return (
    <section aria-label="NPC relationship" className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{npcName}</div>
          <div className="text-xs opacity-60">{tier}</div>
        </div>
        <div className="text-sm tabular-nums">Affinity {affinity}</div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white/60" style={{ width: `${Math.max(0, Math.min(100, (affinity + 100) / 2))}%` }} />
      </div>
      <div className="mt-4 space-y-1">
        <div className="text-xs uppercase tracking-widest opacity-50">Recent memories</div>
        {recentMemories.length === 0 ? (
          <div className="text-xs opacity-60">No memories recorded.</div>
        ) : (
          recentMemories.map((memory) => <div key={memory} className="text-xs opacity-80">{memory}</div>)
        )}
      </div>
      {onGift && <button type="button" onClick={onGift} className="mt-4 rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/10">Give Gift</button>}
    </section>
  );
}
