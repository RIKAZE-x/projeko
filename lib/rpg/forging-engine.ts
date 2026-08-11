export type ForgeOperation = 'craft' | 'upgrade' | 'reroll-affix';
export type ForgeQuality = 'poor' | 'standard' | 'fine' | 'masterwork' | 'legendary';

export interface MaterialStack { materialId: string; quantity: number; }
export interface ForgeRecipe {
  id: string;
  outputItemId: string;
  operation: ForgeOperation;
  materials: MaterialStack[];
  goldCost?: number;
  minRank?: number;
}

export interface ForgeInput {
  recipe: ForgeRecipe;
  inventoryMaterials: Record<string, number>;
  gold: number;
  playerRank: number;
  transactionId: string;
  qualitySeed?: number;
}

export interface ForgeResult {
  ok: boolean;
  reason?: 'missing-materials' | 'insufficient-gold' | 'rank-too-low' | 'invalid-quantity';
  gold: number;
  goldSpent: number;
  materials: Record<string, number>;
  outputItemId?: string;
  transactionKey?: string;
  quality?: ForgeQuality;
}

function qualityFromSeed(seed: number): ForgeQuality {
  const roll = Math.abs(seed) % 100;
  if (roll >= 98) return 'legendary';
  if (roll >= 90) return 'masterwork';
  if (roll >= 70) return 'fine';
  if (roll >= 30) return 'standard';
  return 'poor';
}

export function executeForge(input: ForgeInput): ForgeResult {
  const { recipe } = input;
  if (input.playerRank < (recipe.minRank ?? 0)) {
    return { ok: false, reason: 'rank-too-low', gold: input.gold, goldSpent: 0, materials: { ...input.inventoryMaterials } };
  }
  const goldCost = recipe.goldCost ?? 0;
  if (input.gold < goldCost) {
    return { ok: false, reason: 'insufficient-gold', gold: input.gold, goldSpent: 0, materials: { ...input.inventoryMaterials } };
  }
  const materials = { ...input.inventoryMaterials };
  for (const req of recipe.materials) {
    if (!Number.isInteger(req.quantity) || req.quantity < 1) {
      return { ok: false, reason: 'invalid-quantity', gold: input.gold, goldSpent: 0, materials };
    }
    if ((materials[req.materialId] ?? 0) < req.quantity) {
      return { ok: false, reason: 'missing-materials', gold: input.gold, goldSpent: 0, materials };
    }
  }
  for (const req of recipe.materials) materials[req.materialId] -= req.quantity;
  const quality = qualityFromSeed(input.qualitySeed ?? 0);
  return {
    ok: true,
    gold: input.gold - goldCost,
    goldSpent: goldCost,
    materials,
    outputItemId: recipe.outputItemId,
    transactionKey: `forge:${recipe.id}:${input.transactionId}`,
    quality,
  };
}
