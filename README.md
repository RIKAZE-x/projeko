# VEILBOUND — Chronicles of the Last Flame

A detailed dark-fantasy RPG prototype built with Next.js + React. The interface combines deterministic combat, character switching, quests, inventory/lore panels, progression, combat logs, and an optional OpenAI-powered Oracle.

## Features

- Three playable heroes with distinct stats and roles.
- HP, mana, XP, levels, gold, armor, enemy scaling and rewards.
- Attack, Astral Art, Guard and camp/rest actions.
- Quest journal, inventory and lore tabs.
- Live chronicle/combat event feed.
- Responsive dark-fantasy UI designed for desktop and mobile.
- `/api/ai` server route for contextual RPG narration using the OpenAI Responses API.

## Run locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`.
3. Start: `npm run dev`
4. Open `http://localhost:3000`.

The API key must remain server-side; do not prefix it with `NEXT_PUBLIC_`.

## Roadmap

The prototype is intentionally structured so it can grow into a full RPG: persistent saves, equipment affixes, skill trees, procedural maps, NPC relationships, crafting, status effects, boss phases, multiplayer-ready state boundaries, and AI-generated quests/lore.
