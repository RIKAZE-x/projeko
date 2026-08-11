import type { Character, Item } from './types';
import { itemPower } from './engine';

export interface EquipmentDelta { slot:'Weapon'|'Armor'|'Accessory'; previous?:Item; next:Item; powerBefore:number; powerAfter:number; }

function sameSlot(item:Item, slot:EquipmentDelta['slot']) {
  if(slot==='Weapon') return item.category==='Weapon';
  if(slot==='Armor') return item.category==='Armor';
  return item.category==='Accessory';
}

export function inventoryWithLoot(character:Character, loot:Item):Character {
  return {...character,equipment:[...character.equipment,loot]};
}

export function equipItem(character:Character, itemId:string, slot:EquipmentDelta['slot']):{character:Character;delta:EquipmentDelta} {
  const next=character.equipment.find(i=>i.id===itemId);
  if(!next || !sameSlot(next,slot)) throw new Error(`Cannot equip item ${itemId} in ${slot}`);
  const previous=character.equipment.find(i=>i.ownerId===`equipped:${slot}`);
  const powerBefore=previous?itemPower(previous):0;
  const powerAfter=itemPower(next);
  const equipment=character.equipment.map(i=>i.id===next.id?{...i,ownerId:`equipped:${slot}`}:i.id===previous?.id?{...i,ownerId:character.id}:i);
  return {character:{...character,equipment},delta:{slot,previous,next:{...next,ownerId:`equipped:${slot}`},powerBefore,powerAfter}};
}

export function compareItems(a:Item,b:Item){
 return {powerA:itemPower(a),powerB:itemPower(b),powerDelta:itemPower(a)-itemPower(b),qualityDelta:a.quality-b.quality,conditionDelta:a.condition-b.condition,affixDelta:a.affixes.length-b.affixes.length};
}
