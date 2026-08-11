# Player Skill Targeting

Player skills now use the same grid-space model as boss telegraphs.

Flow:

1. Select a skill.
2. Preview its AoE tiles.
3. Validate range and cooldown.
4. Confirm the target tile.
5. Emit a skill cast event.
6. Apply cooldown and advance the tactical turn.

The targeting UI is intentionally separate from CombatPanel so it can be embedded into normal combat and boss encounters without duplicating combat rules.
