'use client';
import { telegraphTiles, type GridPoint } from '../../lib/rpg/boss-aoe';
import type { CombatTelegraph } from '../../lib/rpg/boss-combat-engine';
export function BossAoETiles({telegraph,origin}:{telegraph:CombatTelegraph;origin:GridPoint}){
 const tiles=telegraphTiles(telegraph,origin);
 return <>{tiles.map(t=><div key={`${t.x}-${t.y}`} className="boss-aoe-cell" style={{position:'absolute',left:t.x*32,top:t.y*32,width:32,height:32}} />)}</>;
}
