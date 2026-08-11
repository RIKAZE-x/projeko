export type AssetCategory='tile'|'prop'|'hero'|'monster'|'item'|'ui';
export interface AssetDefinition{id:string;category:AssetCategory;source:string;license:'CC0';path:string;fallback?:string;}

export const ASSET_REGISTRY:AssetDefinition[]=[
 {id:'tile.dungeon.floor',category:'tile',source:'Kenney Roguelike/RPG Pack',license:'CC0',path:'/assets/kenney/roguelike-rpg/tile-floor.png'},
 {id:'tile.dungeon.wall',category:'tile',source:'Kenney Roguelike/RPG Pack',license:'CC0',path:'/assets/kenney/roguelike-rpg/tile-wall.png'},
 {id:'prop.chest.iron',category:'prop',source:'Kenney Roguelike/RPG Pack',license:'CC0',path:'/assets/kenney/roguelike-rpg/chest.png'},
 {id:'prop.shrine.basic',category:'prop',source:'Kenney RPG Base',license:'CC0',path:'/assets/kenney/rpg-base/shrine.png'},
 {id:'monster.slime.verdant',category:'monster',source:'Kenney Roguelike/RPG Pack',license:'CC0',path:'/assets/kenney/roguelike-rpg/slime.png'},
 {id:'ui.panel.rpg',category:'ui',source:'Kenney UI Pack (RPG Expansion)',license:'CC0',path:'/assets/kenney/ui-rpg/panel.png'},
];
export function asset(id:string){return ASSET_REGISTRY.find(a=>a.id===id);}
