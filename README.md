# VEILBOUND — Chronicles of the Last Flame

VEILBOUND is a systems-first dark-fantasy RPG prototype built in Next.js. The current branch turns the original interface into a canonical RPG simulation layer with deterministic game rules plus an optional OpenAI Oracle.

## Implemented architecture

- **Item Identity:** `Base + Quality + Rank + Affix + Trait + Soul + History + Condition`.
- **Material system:** Iron, Mithril, Dragon Bone and Void Metal expose different hardness, durability, mana conductivity, elemental affinity and reality properties.
- **Quality system:** Defective → Poor → Normal → Fine → Excellent → Masterwork → Perfect.
- **Rarity:** Broken → Common → Uncommon → Rare → Epic → Legendary → Mythic.
- **Skills:** Grade/Rank + Tier + Level + Mastery + Authority, with limitations and evolution hooks.
- **Characters:** race, level, attributes, profession progression, skill loadout, equipment, gold and reputation.
- **Profession evolution:** profession rank and branches are separate from combat level and can evolve through achievements.
- **Monster threat:** F → E → D → C → B → A → S → SS → SSS → EX/Mythic → Calamity → Divine. Threat rank is not an automatic win condition.
- **Economy:** inflation, public trust, material prices and Grand Treasury reserves are represented in the game state.
- **World scale:** 7 continents, 9 major seas, 12 major powers, 31 autonomous regions and ~3,800 registered dungeons are represented as world metadata.
- **Combat engine:** deterministic item power, attribute scaling, monster mitigation, conditional affixes, XP and gold rewards.
- **Oracle:** OpenAI Responses API is grounded with current hero, monster, economy and world state.

## Development

```bash
npm install
npm run dev
```

For the Oracle, configure `OPENAI_API_KEY` and optionally `OPENAI_MODEL` on the server. Never expose the key to client-side code.

## Roadmap

1. Persistence/save slots and authoritative server state.
2. Full equipment slots, crafting, durability and procedural affix generation.
3. Skill tree/evolution UI and profession achievement triggers.
4. Dungeon generation, bosses, status effects and party AI.
5. NPC relationships, factions, dynamic quests and economy simulation.
6. Database-backed multiplayer-ready state and anti-cheat validation.
