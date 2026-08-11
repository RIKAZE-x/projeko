import type { Character, GameState, Item } from './types';

export interface ShopListing { id:string; item:Item; price:number; stock:number; }
export interface TownState { id:string; name:string; goldPriceIndex:number; shop:ShopListing[]; services:string[]; }

export function calculateShopPrice(item:Item, economyIndex:number){return Math.max(1,Math.round((item.level*12+item.quality*2+item.affixes.length*20)*economyIndex));}
export function createTown(id:string,name:string,items:Item[],economyIndex=1){return {id,name,goldPriceIndex:economyIndex,services:['Inn','Blacksmith','Adventurer Guild','General Store'],shop:items.map((item,i)=>({id:`listing-${id}-${i}`,item,price:calculateShopPrice(item,economyIndex),stock:2}))};}
export function buyFromShop(game:GameState,shop:TownState,listingId:string):{game:GameState;error?:string}{const listing=shop.shop.find(x=>x.id===listingId);if(!listing)return {game,error:'Listing not found'};if(listing.stock<=0)return {game,error:'Out of stock'};if(game.character.gold<listing.price)return {game,error:'Not enough gold'};return {game:{...game,character:{...game.character,gold:game.character.gold-listing.price,equipment:[...game.character.equipment,listing.item]}},error:undefined};}
export function sellItem(character:Character,itemId:string,price:number):Character{const index=character.equipment.findIndex(i=>i.id===itemId);if(index<0)return character;const equipment=character.equipment.filter(i=>i.id!==itemId);return {...character,equipment,gold:character.gold+Math.max(1,price)};}
