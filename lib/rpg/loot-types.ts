export type LootRarity='common'|'uncommon'|'rare'|'epic'|'legendary';
export type LootKind='weapon'|'armor'|'accessory'|'consumable'|'material';
export interface LootItem { id:string; name:string; rarity:LootRarity; kind:LootKind; power:number; quantity:number; }
export interface LootDropTable { id:string; entries:Array<{item:LootItem;weight:number}>; guaranteed?:LootItem[]; }
