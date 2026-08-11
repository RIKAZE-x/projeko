export interface MarketState {
  prices: Record<string, number>;
  supply: Record<string, number>;
  demand: Record<string, number>;
  inflation: number;
  treasury: number;
  taxRate: number;
}

export interface EconomyEvent {
  type: 'dungeon-discovered' | 'route-disrupted' | 'monster-migration' | 'war' | 'core-shortage' | 'world-core-drain';
  intensity: number;
}

export function applyEconomyEvent(state: MarketState, event: EconomyEvent): MarketState {
  const next = structuredClone(state);
  if (event.type === 'dungeon-discovered') {
    next.supply['monster-core'] = (next.supply['monster-core'] ?? 0) + 50 * event.intensity;
    next.demand['adventurer-services'] = (next.demand['adventurer-services'] ?? 0) + 20 * event.intensity;
  }
  if (event.type === 'route-disrupted') {
    next.supply['food'] = Math.max(0, (next.supply['food'] ?? 0) - 30 * event.intensity);
    next.demand['food'] = (next.demand['food'] ?? 0) + 20 * event.intensity;
  }
  if (event.type === 'monster-migration') {
    next.demand['weapons'] = (next.demand['weapons'] ?? 0) + 35 * event.intensity;
    next.demand['healing'] = (next.demand['healing'] ?? 0) + 30 * event.intensity;
  }
  if (event.type === 'war') {
    next.demand['weapons'] = (next.demand['weapons'] ?? 0) + 80 * event.intensity;
    next.supply['food'] = Math.max(0, (next.supply['food'] ?? 0) - 45 * event.intensity);
    next.inflation += 0.01 * event.intensity;
  }
  if (event.type === 'core-shortage') {
    next.supply['monster-core'] = Math.max(0, (next.supply['monster-core'] ?? 0) - 60 * event.intensity);
    next.inflation += 0.02 * event.intensity;
  }
  if (event.type === 'world-core-drain') {
    next.supply['mana-crystal'] = Math.max(0, (next.supply['mana-crystal'] ?? 0) - 70 * event.intensity);
    next.demand['mana-crystal'] = (next.demand['mana-crystal'] ?? 0) + 60 * event.intensity;
    next.inflation += 0.05 * event.intensity;
  }
  return recalculatePrices(next);
}

export function recalculatePrices(state: MarketState): MarketState {
  const next = structuredClone(state);
  const keys = new Set([...Object.keys(next.supply), ...Object.keys(next.demand), ...Object.keys(next.prices)]);
  for (const key of keys) {
    const supply = Math.max(1, next.supply[key] ?? 1);
    const demand = Math.max(1, next.demand[key] ?? 1);
    const base = next.prices[key] ?? 10;
    next.prices[key] = Math.max(1, Math.round(base * (1 + (demand / supply - 1) * 0.15 + next.inflation)));
  }
  return next;
}

export function applyQuestTax(reward: number, taxRate = 0.02) {
  return { gross: reward, tax: Math.floor(reward * taxRate), net: Math.max(0, reward - Math.floor(reward * taxRate)) };
}

export function currencyBreakdown(nim: number) {
  const sil = Math.floor(nim / 100);
  const remainder = nim % 100;
  const aren = Math.floor(sil / 100);
  return { aren, sil: sil % 100, nim: remainder };
}
