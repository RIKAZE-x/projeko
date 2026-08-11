'use client';

import { useMemo, useState } from 'react';
import type { DialogueNode } from '@/lib/rpg/npc-dialogue-runtime';

export interface NPCDialoguePanelProps {
 node: DialogueNode;
 onChoose(choiceId: string): void;
 onClose?: () => void;
 disabled?: boolean;
}

export function NPCDialoguePanel({node,onChoose,onClose,disabled=false}:NPCDialoguePanelProps){
 const [selected,setSelected]=useState<string|null>(null);
 const choices=useMemo(()=>node.choices,[node.choices]);
 return <section aria-label="NPC dialogue" className="rounded-xl border border-white/10 bg-black/30 p-4">
  <div className="mb-3 text-xs uppercase tracking-widest opacity-60">{node.speaker}</div>
  <p className="mb-4 text-sm leading-6">{node.text}</p>
  <div className="space-y-2">
   {choices.map(choice=><button key={choice.id} type="button" disabled={disabled} onClick={()=>{setSelected(choice.id);onChoose(choice.id)}} className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition ${selected===choice.id?'border-white/40 bg-white/10':'border-white/10 bg-white/5 hover:bg-white/10'} disabled:cursor-not-allowed disabled:opacity-40`}>{choice.text}</button>)}
  </div>
  {onClose && <button type="button" onClick={onClose} className="mt-3 text-xs opacity-60 hover:opacity-100">Close</button>}
 </section>;
}
