export type RoleLayer = 'Origin' | 'Core' | 'Path' | 'Soul' | 'Fate' | 'Sin' | 'True';
export type RoleRank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'EX' | '???' | '∅';

export interface RoleState {
  origin: string;
  core: string;
  path?: string;
  soul?: string;
  fate?: string;
  sin?: string;
  trueRole?: string;
  rank: RoleRank;
  convictions: Record<string, number>;
  achievements: string[];
  counters: Record<string, number>;
}

export interface EvolutionRule {
  from: string;
  to: string;
  requiredCounters?: Record<string, number>;
  requiredAchievements?: string[];
  forbiddenCounters?: Record<string, number>;
  requiredConviction?: { key: string; min: number };
}

export const ROLE_EVOLUTIONS: EvolutionRule[] = [
  { from: 'Swordsman', to: 'Knight Errant', requiredCounters: { duelsWon: 100, mercyVictories: 100, swordMastery: 70 } },
  { from: 'Swordsman', to: 'Executioner', requiredCounters: { kills: 100 } },
  { from: 'Swordsman', to: 'Duel Sovereign', requiredCounters: { duelsWon: 100 }, forbiddenCounters: { duelLosses: 1 } },
  { from: 'Villager', to: 'Lord of the Homeland', requiredCounters: { farming: 100, cooking: 100, housekeeping: 100, localKnowledge: 100 } },
  { from: 'Gravekeeper', to: 'Lord of the Dead', requiredCounters: { soulAccumulation: 100000 } },
  { from: 'The Survivor', to: 'The Protector', requiredCounters: { alliesProtected: 100 }, requiredConviction: { key: 'protect', min: 80 } },
  { from: 'The Protector', to: 'The Rebel', requiredAchievements: ['betrayed-kingdom-to-save-civilians'] },
  { from: 'The Rebel', to: 'The Kingmaker', requiredAchievements: ['killed-a-king'] },
  { from: 'The Kingmaker', to: 'The Truth-Seeker', requiredAchievements: ['discovered-system-manipulation'] },
];

export function canEvolve(state: RoleState, rule: EvolutionRule) {
  if (state.core !== rule.from && state.path !== rule.from && state.trueRole !== rule.from) return false;
  for (const [key, required] of Object.entries(rule.requiredCounters ?? {})) {
    if ((state.counters[key] ?? 0) < required) return false;
  }
  for (const [key, forbidden] of Object.entries(rule.forbiddenCounters ?? {})) {
    if ((state.counters[key] ?? 0) >= forbidden) return false;
  }
  for (const achievement of rule.requiredAchievements ?? []) {
    if (!state.achievements.includes(achievement)) return false;
  }
  if (rule.requiredConviction && (state.convictions[rule.requiredConviction.key] ?? 0) < rule.requiredConviction.min) return false;
  return true;
}

export function discoverEvolutions(state: RoleState) {
  return ROLE_EVOLUTIONS.filter((rule) => canEvolve(state, rule));
}

export function applyEvolution(state: RoleState, rule: EvolutionRule): RoleState {
  if (!canEvolve(state, rule)) throw new Error('Evolution conditions are not fulfilled');
  return { ...state, path: rule.to, achievements: [...state.achievements, `evolved:${rule.to}`] };
}

export function registerAction(state: RoleState, action: string, amount = 1): RoleState {
  return { ...state, counters: { ...state.counters, [action]: (state.counters[action] ?? 0) + amount } };
}

export function registerConviction(state: RoleState, key: string, amount: number) {
  return { ...state, convictions: { ...state.convictions, [key]: Math.max(0, Math.min(100, (state.convictions[key] ?? 0) + amount)) } };
}
