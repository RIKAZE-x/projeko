# Canonical Scene State

All cross-page travel should use `pendingProfile`, not a raw GameState-only handoff.

A scene may still accept legacy `pendingState` as a compatibility fallback, but new routes should create a canonical profile containing:
- GameState
- SocialState
- dungeon seed
- room index
- save metadata

Scene hydration must clear the pending profile after a successful read so refreshes do not replay the handoff.
