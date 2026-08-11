import type { Affix, Item, Material, Rank, Rarity } from './types';
import { qualityBand, rankValue } from './engine';

const ranks:Rank[]=['F','E','D','C','B','A','S','SS','SSS','EX','Ω'];
const rarities:Rarity[]=['Broken','Common','Uncommon','Rare','Epic','Legendary','Mythic'];
const affixes:Affix[]=[
 {id:'keen',name:'Keen Edge',rank:1,description:'+critical potential'},
 {id:'hunter',name:'Hunter',rank:2,description:'+damage against monsters'},
 {id:'vital',name:'Vital',rank:2,description:'+durability and vitality'},
 {id:'mana',name:'Mana Conduit',rank:3,description:'+mana conductivity'},
 {id:'void',name:'Void-Touched',rank:5,description:'interacts with void phenomena'},
 {id:'soul',name:'Soulbound',rank:6,description:'grows through owner history'},
];
function random(seed:number){let x=seed|0;return()=>{x=Math.imul(1103515245,x)+12345|0;return (x>>>0)/4294967296;};}
export function generateLoot(seed:number, level:number, material:Material, baseType='Greatsword'):Item {
 const r=random(seed); const quality=Math.round(35+r()*65); const rank=ranks[Math.min(ranks.length-1,Math.floor(level/15)+Math.floor(r()*2))]; const rarity=rarities[Math.min(rarities.length-1,Math.floor(rankValue(rank)/2))]; const count=Math.min(4,Math.floor(r()*3)+1); const selected=affixes.slice().sort(()=>r()-.5).slice(0,count);
 return {id:`loot-${seed}`,name:`${qualityBand(quality)} ${material.name} ${baseType}`,category:'Weapon',baseType,material,level,quality,rank,rarity,affixes:selected,traits:[],soulResonance:Math.round(r()*20),history:{kills:0,ownerYears:0,notableEvents:[]},condition:100};
}
