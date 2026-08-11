import type { Item } from './types';
import type { ForgeQuality } from './forging-engine';

const QUALITY_FLOOR: Record<ForgeQuality, number> = {
  poor: 20,
  standard: 45,
  fine: 70,
  masterwork: 90,
  legendary: 98,
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export interface ForgeItemOperation {
  item: Item;
  quality: ForgeQuality;
  operation: 'craft' | 'upgrade' | 'reroll-affix';
  transactionId: string;
  statPowerBonus?: number;
  addAffixId?: string;
}

export function applyForgeToItem(input: ForgeItemOperation): Item {
  const current = input.item;
  const minQuality = QUALITY_FLOOR[input.quality];
  const qualityBonus = Math.max(0, minQuality - current.quality);
  const powerBonus = input.statPowerBonus ?? Math.ceil(qualityBonus / 8);

  const nextAffixes = input.addAffixId && !current.affixes.some((affix) => affix.id === input.addAffixId)
    ? [...current.affixes, {
        id: input.addAffixId,
        name: input.addAffixId,
        rank: Math.max(1, Math.min(6, Math.floor((current.level + qualityBonus) / 15) + 1)),
        description: `Forged through ${input.operation}`,
      }]
    : current.affixes;

  return {
    ...current,
    id: `${current.id}:forge:${input.transactionId}`,
    name: input.operation === 'upgrade' ? `${current.name} +${Math.max(1, powerBonus)}` : current.name,
    quality: clamp(Math.max(current.quality, minQuality), 1, 100),
    affixes: nextAffixes,
    soulResonance: clamp(current.soulResonance + (input.operation === 'upgrade' ? 1 : 0), 0, 100),
    history: {
      ...current.history,
      notableEvents: [...current.history.notableEvents, `forge:${input.operation}:${input.transactionId}`],
    },
  };
}
