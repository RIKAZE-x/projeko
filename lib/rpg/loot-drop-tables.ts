import type { LootItem, LootDropTable, LootRarity } from './loot-types';

export const lootRarityWeights:Record<LootRarity,number>={common:55,uncommon:27,rare:12,epic:5,legendary:1};
export const basicDungeonTable:LootDropTable={
 id:'dungeon-basic',
 guaranteed:[{id:'iron-shard',name:'Iron Shard',rarity:'common',kind:'material',power:1,quantity:1}],
 entries:[
  {weight:55,item:{id:'iron-shard',name:'Iron Shard',rarity:'common',kind:'material',power:1,quantity:1}},
  {weight:27,item:{id:'mana-dust',name:'Mana Dust',rarity:'uncommon',kind:'material',power:2,quantity:1}},
  {weight:12,item:{id:'ember-rune',name:'Ember Rune',rarity:'rare',kind:'accessory',power:8,quantity:1}},
  {weight:5,item:{id:'veil-cloak',name:'Veil Cloak',rarity:'epic',kind:'armor',power:18,quantity:1}},
  {weight:1,item:{id:'crown-of-ashes',name:'Crown of Ashes',rarity:'legendary',kind:'accessory',power:35,quantity:1}}
 ]
};
