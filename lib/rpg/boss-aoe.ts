import type { TelegraphShape, CombatTelegraph } from './boss-combat-engine';
export interface GridPoint{x:number;y:number;}
export function telegraphTiles(telegraph:CombatTelegraph,origin:GridPoint,width=12,height=8):GridPoint[]{
 const out:GridPoint[]=[]; const add=(x:number,y:number)=>{if(x>=0&&y>=0&&x<width&&y<height)out.push({x,y});};
 if(telegraph.shape==='single')add(origin.x,origin.y);
 if(telegraph.shape==='line'){for(let x=0;x<width;x++)add(x,origin.y);}
 if(telegraph.shape==='cross'){for(let x=0;x<width;x++)add(x,origin.y);for(let y=0;y<height;y++)add(origin.x,y);}
 if(telegraph.shape==='ring'){for(let x=0;x<width;x++)for(let y=0;y<height;y++){const d=Math.abs(x-origin.x)+Math.abs(y-origin.y);if(d===2)add(x,y);}}
 if(telegraph.shape==='cone'){for(let x=origin.x;x<Math.min(width,origin.x+4);x++)for(let y=Math.max(0,origin.y-1);y<=Math.min(height-1,origin.y+1);y++)add(x,y);}
 return out;
}
export function isPointTargeted(tiles:GridPoint[],point:GridPoint){return tiles.some(t=>t.x===point.x&&t.y===point.y);}
