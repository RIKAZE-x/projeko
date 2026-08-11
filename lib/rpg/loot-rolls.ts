import type { LootDropTable, LootItem } from './loot-types';

function hash(input:string){let h=2166136261;for(let i=0;i<input.length;i++){h^=input.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
export function rollLoot(seed:number,sourceId:string,table:LootDropTable,count=1):LootItem[]{
 const out=(table.guaranteed??[]).map(x=>({...x}));
 const entries=table.entries.filter(e=>e.weight>0); const total=entries.reduce((sum,e)=>sum+e.weight,0); if(!entries.length||total<=0)return out;
 for(let i=0;i<count;i++){let cursor=hash(`${seed}:${sourceId}:${i}`)%total;for(const e of entries){cursor-=e.weight;if(cursor<0){out.push({...e.item});break;}}}
 return out;
}
export function rarityMultiplier(rarity:LootItem['rarity']){return {common:1,uncommon:1.2,rare:1.6,epic:2.2,legendary:3}[rarity];}
