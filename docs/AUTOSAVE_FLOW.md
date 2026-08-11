# Autosave Flow

Autosave uses the canonical profile format and writes one latest checkpoint per slot.

Checkpoint events:
- town-enter
- travel-complete
- dungeon-room
- combat-victory
- quest-choice
- evolution

Each checkpoint contains GameState, SocialState, dungeon seed, room index, metadata, and save version.

The `AutosaveBadge` component writes the checkpoint when its event identity changes and gives short UI feedback. Production UI should trigger it only at semantic milestones, not on every render.

Autosave is currently browser-local. Server persistence is a later production milestone.
