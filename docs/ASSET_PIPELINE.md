# VEILBOUND 2D Asset Pipeline

## Art direction

VEILBOUND uses a cohesive 2D fantasy pixel-art direction. Gameplay assets should favor a consistent tile scale, readable silhouettes, limited palette families, and layered foreground/background depth.

## Primary asset source: Kenney

- RPG Base: https://www.kenney.nl/assets/rpg-base — 2D, 230 files, CC0.
- Roguelike/RPG Pack: https://www.kenney.nl/assets/roguelike-rpg-pack — 16x16, 1700 files, CC0.
- UI Pack (RPG Expansion): https://www.kenney.nl/assets/ui-pack-rpg-expansion — 85 files, CC0.

These are preferred for terrain, props, dungeon pieces, UI panels, and generic RPG objects because their CC0 licensing minimizes redistribution friction.

## Supplemental source: OpenGameArt

- RPG Tileset by Russpuppy: https://opengameart.org/content/rpg-tileset — CC0; includes knight, archer, mage, skeleton, cave, building, water, monsters, treasure and props.
- RPG Tilesets Pack by TheNess: https://opengameart.org/content/rpg-tilesets-pack — CC0; 16x16 grass, dirt, dungeon and bridge tiles.
- RPG Dungeon Vol 2 by Corey Archer: https://opengameart.org/content/rpg-dungeon-vol-2 — CC0; 16x16 overhead dungeon tiles.
- RPG Tileset 32x32 by gfx0: https://opengameart.org/content/rpg-tileset-32x32 — CC0/CC-BY 3.0 listing; if this source is used, retain author credit in CREDITS.md.

## Asset rules

1. Do not hotlink third-party art in production. Download and vendor approved assets into `public/assets/` with a license record.
2. Prefer CC0 assets. For CC-BY/CC-BY-SA assets, retain the exact attribution and license text.
3. Do not mix radically different pixel scales in one scene unless the asset is intentionally UI-only.
4. Every vendored asset pack gets an entry in `docs/ASSET_CREDITS.md` with source URL, author, license, and date checked.
5. Original/generated art can replace placeholder art later without changing gameplay data IDs.

## Runtime asset manifest

Gameplay content refers to stable logical IDs instead of filenames. Example: `tile.dungeon.wall`, `prop.chest.iron`, `monster.slime.verdant`, `hero.human.warrior`, `ui.panel.quest`. This lets art packs be replaced without rewriting RPG systems.
