export type WorldLayer = 'Mortal' | 'Monster' | 'Dungeon' | 'Spirit' | 'Astral' | 'Void' | 'System' | 'Authority' | 'Archetype';
export type RaceId = 'human' | 'aelari' | 'dhurak' | 'varkhan' | 'nymari' | 'sylphid' | 'dravari' | 'myr' | 'elyndra' | 'noctari' | 'astraen' | 'construct';

export interface RaceDefinition {
  id: RaceId;
  name: string;
  concept: string;
  passive: string;
  signature: string[];
  drawback: string;
}

export interface RegionDefinition {
  id: string;
  name: string;
  layer: WorldLayer;
  dominantRaces: RaceId[];
  economy: string;
  danger: string;
  hooks: string[];
}

export interface TradeRoute {
  name: string;
  from: string;
  to: string;
  goods: string[];
  risk: number;
}

export const RACES: RaceDefinition[] = [
  { id: 'human', name: 'Human', concept: 'The Adaptive', passive: 'Adaptive Soul', signature: ['flexible ancestry talent', 'extra proficiency option'], drawback: 'No extreme racial specialization' },
  { id: 'aelari', name: 'Aelari', concept: 'Children of Memory', passive: 'Echo Memory', signature: ['ancestral memory', 'memory-based investigation'], drawback: 'Memory Overload / Soul Fragmentation' },
  { id: 'dhurak', name: 'Dhurak', concept: 'Children of Stone', passive: 'Stonebody', signature: ['Corestone', 'Stone Awakening'], drawback: 'Heavy armor reduces mobility' },
  { id: 'varkhan', name: 'Varkhan', concept: 'Children of the Hunt', passive: 'Blood Momentum', signature: ['Predator Dash', 'Tectonic Charge'], drawback: 'Momentum is lost when disengaging' },
  { id: 'nymari', name: 'Nymari', concept: 'Children of the Deep', passive: 'Tide Sense', signature: ['aquatic breathing', 'pressure sensing'], drawback: 'Abyssal adaptation can alter identity' },
  { id: 'sylphid', name: 'Sylphid', concept: 'Wind-Born', passive: 'Aerial Movement', signature: ['double jump', 'glide', 'air dash'], drawback: 'gravity magic vulnerability' },
  { id: 'dravari', name: 'Dravari', concept: 'Dragon-Blooded', passive: 'Dragon Resonance', signature: ['primordial affinity', 'Draconic Form'], drawback: 'Resonance can destabilize under opposing elements' },
  { id: 'myr', name: 'Myr', concept: 'The Collective', passive: 'Hive Memory', signature: ['Instinct prediction', 'shared memory'], drawback: 'Collective trauma can propagate through the hive' },
  { id: 'elyndra', name: 'Elyndra', concept: 'The Green Soul', passive: 'Worldseed', signature: ['regeneration', 'territorial affinity'], drawback: 'Death can alter personality and memories' },
  { id: 'noctari', name: 'Noctari', concept: 'Children of Shadow', passive: 'Shadow Organ', signature: ['Shadow Step', 'Umbral Cloak', 'Shadow Weapon'], drawback: 'Shadow Depletion in intense light' },
  { id: 'astraen', name: 'Astraen', concept: 'Star-Born', passive: 'Astral Resonance', signature: ['psychic focus', 'astral navigation'], drawback: 'Astral exposure can destabilize the soul' },
  { id: 'construct', name: 'Construct', concept: 'Artificial Life', passive: 'Core Identity', signature: ['modular body', 'machine integration'], drawback: 'Soul status is disputed by world law' },
];

export const REGIONS: RegionDefinition[] = [
  { id: 'valeria', name: 'Valeria', layer: 'Mortal', dominantRaces: ['human', 'aelari'], economy: 'Golden Road, farming, guild services', danger: 'E–C', hooks: ['dungeon boom', 'guild politics', 'merchant houses'] },
  { id: 'dhurak', name: 'Dhurak Mountain Realm', layer: 'Mortal', dominantRaces: ['dhurak'], economy: 'Iron Road, mithril, golem parts', danger: 'D–B', hooks: ['Corestone clans', 'ancient forge', 'machine relics'] },
  { id: 'varkhan', name: 'Varkhan Steppe', layer: 'Mortal', dominantRaces: ['varkhan'], economy: 'beasts, dragon materials, cavalry routes', danger: 'D–A', hooks: ['hunt trials', 'tribal law', 'dragon resonance'] },
  { id: 'nymari-depths', name: 'Nymari Deep', layer: 'Mortal', dominantRaces: ['nymari'], economy: 'pearls, coral, water magic', danger: 'C–S', hooks: ['abyssal currents', 'lost temples', 'sea monsters'] },
  { id: 'machine-continent', name: 'Machine Continent', layer: 'Mortal', dominantRaces: ['construct', 'dhurak'], economy: 'factories, repair, automation', danger: 'C–SS', hooks: ['Core Council', 'soul rights', 'rogue automata'] },
  { id: 'demon-continent', name: 'Demon Continent', layer: 'Monster', dominantRaces: [], economy: 'demon contracts and cursed resources', danger: 'B–SSS', hooks: ['demon courts', 'war scars', 'sealed calamity'] },
  { id: 'astral-sea', name: 'Astral Sea', layer: 'Astral', dominantRaces: ['astraen', 'aelari'], economy: 'astral relics and star routes', danger: 'A–Mythic', hooks: ['astral gates', 'memory constellations', 'celestial predators'] },
  { id: 'eclipse', name: 'Eclipse', layer: 'System', dominantRaces: [], economy: 'undefined', danger: 'ERROR', hooks: ['Nameless population', 'broken appraisal', 'unregistered reality'] },
  { id: 'void-scar', name: 'The Void Scar', layer: 'Void', dominantRaces: [], economy: 'none', danger: 'Existential', hooks: ['reality damage', 'void entities', 'authority fractures'] },
];

export const TRADE_ROUTES: TradeRoute[] = [
  { name: 'Golden Road', from: 'Valeria', to: 'Crossroads', goods: ['food', 'weapons', 'clothing', 'mana crystal'], risk: 0.15 },
  { name: 'Iron Road', from: 'Dhurak', to: 'Valeria', goods: ['mithril', 'iron', 'weapons', 'armor', 'golem parts'], risk: 0.22 },
  { name: 'Dragon Road', from: 'Varkhan', to: 'Valeria', goods: ['dragon material', 'beast goods', 'volcanic crystal'], risk: 0.42 },
  { name: 'Pearl Route', from: 'Nymari', to: 'Human Kingdom', goods: ['pearl', 'fish', 'coral', 'water magic items'], risk: 0.31 },
  { name: 'Shadow Route', from: 'Noctari', to: 'Black Market', goods: ['forbidden items', 'poison', 'information', 'illegal artifacts'], risk: 0.7 },
];

export const WORLD_LAYERS: Array<{ id: WorldLayer; description: string }> = [
  { id: 'Mortal', description: 'Civilization and ordinary races' },
  { id: 'Monster', description: 'Monster ecology' },
  { id: 'Dungeon', description: 'Dungeon spaces and resource engines' },
  { id: 'Spirit', description: 'Souls and spiritual phenomena' },
  { id: 'Astral', description: 'Cosmic regions' },
  { id: 'Void', description: 'Reality gaps and nothingness' },
  { id: 'System', description: 'World rules and appraisal' },
  { id: 'Authority', description: 'Conceptual power' },
  { id: 'Archetype', description: 'Foundational patterns beyond ordinary power' },
];

export function getRegion(id: string) {
  return REGIONS.find((region) => region.id === id);
}
