'use client';

import { useMemo, useState } from 'react';
import type { DialogueNode } from '@/lib/rpg/npc-dialogue-runtime';
import type { DialogueRequirements, DialogueGateContext } from '@/lib/rpg/npc-dialogue-gating';
import { checkDialogueRequirements } from '@/lib/rpg/npc-dialogue-gating';

export interface NPCDialogueGatedPanelProps {
  node: DialogueNode;
  choiceRequirements?: Record<string, DialogueRequirements>;
  context: DialogueGateContext;
  onChoose(choiceId: string): void;
  onClose?: () => void;
}

export function NPCDialogueGatedPanel({
  node,
  choiceRequirements = {},
  context,
  onChoose,
  onClose,
}: NPCDialogueGatedPanelProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const gates = useMemo(() => Object.fromEntries(
    node.choices.map((choice) => [choice.id, checkDialogueRequirements(choiceRequirements[choice.id], context)]),
  ), [choiceRequirements, context, node.choices]);

  return <section aria-label="NPC dialogue" className="rounded-xl border border-white/10 bg-black/30 p-4">
    <div className="mb-3 text-xs uppercase tracking-widest opacity-60">{node.speaker}</div>
    <p className="mb-4 text-sm leading-6">{node.text}</p>
    <div className="space-y-2">
      {node.choices.map((choice) => {
        const gate = gates[choice.id];
        const locked = !gate.allowed;
        return <div key={choice.id} className="space-y-1">
          <button
            type="button"
            disabled={locked}
            onClick={() => { setSelected(choice.id); onChoose(choice.id); }}
            className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition ${selected === choice.id ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {choice.text}
          </button>
          {locked && <div className="px-3 text-xs opacity-50">{gate.reasons.join(' • ')}</div>}
        </div>;
      })}
    </div>
    {onClose && <button type="button" onClick={onClose} className="mt-3 text-xs opacity-60 hover:opacity-100">Close</button>}
  </section>;
}
