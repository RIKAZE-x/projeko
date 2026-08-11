export type AssetCategory='tile'|'prop'|'hero'|'monster'|'item'|'ui';
export type AssetLicense='CC0'|'CUSTOM';
export interface AssetDefinition{id:string;category:AssetCategory;source:string;license:AssetLicense;path:string;fallback?:string;}

export const ASSET_REGISTRY:AssetDefinition[]=[
 {id:'tile.dungeon.floor',category:'tile',source:'Kenney Roguelike/RPG Pack',license:'CC0',path:'/assets/kenney/roguelike-rpg/tile-floor.png',fallback:'/assets/veilbound/dungeon-floor.svg'},
 {id:'tile.dungeon.wall',category:'tile',source:'Kenney Roguelike/RPG Pack',license:'CC0',path:'/assets/kenney/roguelike-rpg/tile-wall.png',fallback:'/assets/veilbound/dungeon-wall.svg'},
 {id:'prop.door.basic',category:'prop',source:'Kenney Roguelike/RPG Pack',license:'CC0',path:'/assets/kenney/roguelike-rpg/door.png',fallback:'/assets/veilbound/door.svg'},
 {id:'prop.chest.iron',category:'prop',source:'Kenney Roguelike/RPG Pack',license:'CC0',path:'/assets/kenney/roguelike-rpg/chest.png',fallback:'/assets/veilbound/chest.svg'},
 {id:'prop.shrine.basic',category:'prop',source:'Kenney RPG Base',license:'CC0',path:'/assets/kenney/rpg-base/shrine.png',fallback:'/assets/veilbound/shrine.svg'},
 {id:'prop.trap.basic',category:'prop',source:'Kenney Roguelike/RPG Pack',license:'CC0',path:'/assets/kenney/roguelike-rpg/trap.png',fallback:'/assets/veilbound/trap.svg'},
 {id:'monster.slime.verdant',category:'monster',source:'Kenney Roguelike/RPG Pack',license:'CC0',path:'/assets/kenney/roguelike-rpg/slime.png',fallback:'/assets/veilbound/verdant-slime.svg'},
 {id:'hero.human.warrior',category:'hero',source:'VEILBOUND Custom Fallback',license:'CUSTOM',path:'/assets/veilbound/hero-warrior.svg'},
 {id:'ui.panel.rpg',category:'ui',source:'Kenney UI Pack (RPG Expansion)',license:'CC0',path:'/assets/kenney/ui-rpg/panel.png',fallback:'/assets/veilbound/ui-panel.svg'},
];
export function asset(id:string){return ASSET_REGISTRY.find(a=>a.id===id);}
