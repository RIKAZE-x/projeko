# VEILBOUND Vertical Slice Checklist

The first playable slice must satisfy this flow:

1. Main Menu opens without requiring server state.
2. New Game creates `GameState` through `createNewGameState()`.
3. A character can enter the procedural dungeon.
4. Dungeon seed and current room are part of the session state.
5. Encounter resolution updates gameplay logs/rewards.
6. Save Session stores character state + dungeon seed + room index.
7. Load Session restores the same dungeon seed and room index.
8. Slot save/load remains available for character progression.
9. Asset rendering uses logical asset IDs with local fallback.
10. OpenAI Oracle remains optional and never blocks the core game loop.

Known verification limitation: this repository currently has no CI status attached to the latest feature branch commits, so build verification must be run in a real Node/Next.js environment before production deployment.
