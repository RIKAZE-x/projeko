import type { MarketState } from './economy-engine';
import { applyEconomyEvent } from './economy-engine';
import type { QuestState } from './quest-engine';
import { QUESTS, chooseQuest } from './quest-engine';
import type { FactionState } from './faction-engine';
import { modifyFaction, standing, routeRiskModifier } from './faction-engine';
import { INITIAL_WORLD_EVENTS, resolveWorldEvent, type WorldEventState } from './world-event-engine';

export interface WorldRuntime {
  quests: QuestState;
  factions: FactionState[];
  market: MarketState;
  flags: Record<string, boolean>;
  logs: string[];
}

export function createWorldRuntime(): WorldRuntime {
  return {
    quests: { active: ['ashen-bell','wolves-greyfen'], completed: [], failed: [], flags: {}, reputation: {} },
    factions: [
      { id: 'ember-guild', name: 'Ember Guild', reputation: 12, standing: 'neutral', favors: 0, flags: [] },
      { id: 'merchant-league', name: 'Merchant League', reputation: 8, standing: 'neutral', favors: 0, flags: [] },
      { id: 'astral-archive', name: 'Astral Archive', reputation: 0, standing: 'neutral', favors: 0, flags: [] },
    ],
    market: { prices: { food: 10, weapons: 40, healing: 32, 'monster-core': 25, 'mana-crystal': 90 }, supply: { food: 100, weapons: 65, healing: 50, 'monster-core': 80, 'mana-crystal': 45 }, demand: { food: 100, weapons: 80, healing: 75, 'monster-core': 70, 'mana-crystal': 60 }, inflation: 0.02, treasury: 900000, taxRate: 0.02 },
    flags: {},
    logs: ['The world simulation is online.'],
  };
}

export function chooseWorldQuest(runtime: WorldRuntime, questId: string, choiceId: string): WorldRuntime {
  const quest = QUESTS.find(q => q.id === questId);
  if (!quest) throw new Error(`Quest not found: ${questId}`);
  const choice = quest.choices.find(c => c.id === choiceId);
  if (!choice) throw new Error(`Choice not found: ${choiceId}`);
  let factions = runtime.factions;
  if (questId === 'ashen-bell' && choice.id === 'warn-guild') factions = factions.map(f => f.id === 'ember-guild' ? modifyFaction(f, 8, 'guild-mobilized') : f);
  if (questId === 'wolves-greyfen' && choice.id === 'hunt') factions = factions.map(f => f.id === 'ember-guild' ? modifyFaction(f, 2) : f);
  const quests = chooseQuest(runtime.quests, quest, choiceId);
  const log = [`Quest choice: ${choice.label}`, choice.consequence, ...runtime.logs].slice(0, 30);
  return { ...runtime, quests, factions, flags: { ...runtime.flags, ...Object.fromEntries((choice.unlocks ?? []).map(f => [f, true])) }, logs: log };
}

export function triggerWorldEvent(runtime: WorldRuntime, eventId: string): WorldRuntime {
  const projected: WorldEventState = { events: INITIAL_WORLD_EVENTS, flags: Object.keys(runtime.flags).filter(k => runtime.flags[k]), market: runtime.market, quests: [runtime.quests], factions: runtime.factions };
  const result = resolveWorldEvent(projected, eventId);
  const factions = result.factions.map(f => ({ ...f, standing: standing(f.reputation) }));
  return { ...runtime, market: result.market, factions, flags: { ...runtime.flags, ...Object.fromEntries(result.flags.map(f => [f, true])) }, logs: [`World event: ${eventId}`, ...runtime.logs].slice(0, 30) };
}

export function travelRisk(runtime: WorldRuntime) {
  return routeRiskModifier(runtime.factions);
}
