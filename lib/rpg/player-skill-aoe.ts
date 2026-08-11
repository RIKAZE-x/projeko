import type { GridPoint } from './boss-aoe';
import type { PlayerSkill } from './player-skill-engine';

export function resolvePlayerSkill(skill:PlayerSkill,origin:GridPoint,target:GridPoint):{hit:boolean;damage:number;status?:PlayerSkill['status']} {
 const dx=target.x-origin.x,dy=target.y-origin.y;
 const dist=Math.abs(dx)+Math.abs(dy);
 if(dist>skill.range) return {hit:false,damage:0};
 let hit=false;
 switch(skill.shape){
  case 'single': hit=dx===0&&dy===0; break;
  case 'line': hit=dx===0||dy===0; break;
  case 'cross': hit=dx===0||dy===0; break;
  case 'ring': hit=dist===skill.range; break;
  case 'cone': hit=(dx===0&&dy!==0)||(dy===0&&dx!==0); break;
 }
 return {hit,damage:hit?skill.damage:0,status:hit?skill.status:undefined};
}
