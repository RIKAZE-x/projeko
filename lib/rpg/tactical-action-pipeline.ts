import type { TacticalCombatState } from './tactical-combat-engine';
import type { GridPoint } from './boss-aoe';
import { resolvePlayerSkill, type SkillResolution } from './player-skill-resolution';
import type { PlayerSkill } from './player-skill-engine';
import { beginBossTurn, resolveBossTurn, type BossTurnResult } from './boss-turn-runtime';
import type { BossCombatState } from './boss-combat-engine';

export interface TacticalActionResult {
  combat:TacticalCombatState;
  skill:SkillResolution;
  boss?:BossTurnResult;
  victory:boolean;
  defeat:boolean;
  logs:string[];
}

export interface TacticalActionTarget {
  player:GridPoint;
  enemy:GridPoint;
  bossOrigin:GridPoint;
}

export function executePlayerSkill(
  combat:TacticalCombatState,
  skill:PlayerSkill,
  target:TacticalActionTarget,
  bossState?:BossCombatState,
):TacticalActionResult {
  const skillResult=resolvePlayerSkill(skill,target.player,target.enemy,combat.enemyHp);
  const enemyHp=Math.max(0,combat.enemyHp-skillResult.damage);
  let nextCombat={...combat,enemyHp};
  const logs=[skillResult.hit?`${skill.name} hits for ${skillResult.damage}.`:`${skill.name} misses.`];
  if(skillResult.status) logs.push(`Applied ${skillResult.status}.`);
  if(enemyHp<=0) return {combat:nextCombat,skill:skillResult,victory:true,defeat:false,logs:[...logs,'Enemy defeated.']};
  if(bossState){
    const prepared=beginBossTurn(bossState,enemyHp,Math.max(1,combat.enemyMaxHp));
    const boss=prepared.telegraph && prepared.telegraph.warningTurns<=1?resolveBossTurn(prepared,target.player,target.bossOrigin):undefined;
    if(boss){
      nextCombat={...nextCombat,playerHp:Math.max(0,nextCombat.playerHp-boss.damage)};
      logs.push(boss.hit?`Boss hits for ${boss.damage}.`:'Boss attack dodged.');
      if(boss.status) logs.push(`Player suffers ${boss.status}.`);
    }
  } else {
    const counter=Math.max(1,Math.floor(enemyHp/10));
    nextCombat={...nextCombat,playerHp:Math.max(0,nextCombat.playerHp-counter)};
    logs.push(`Enemy counters for ${counter}.`);
  }
  return {combat:nextCombat,skill:skillResult,boss:defeatBossStep(bossState,enemyHp,target),victory:false,defeat:nextCombat.playerHp<=0,logs};
}

function defeatBossStep(state:BossCombatState|undefined,hp:number,target:TacticalActionTarget):BossTurnResult|undefined {
  if(!state) return undefined;
  const prepared=beginBossTurn(state,hp,Math.max(1,hp));
  return prepared.telegraph && prepared.telegraph.warningTurns>1?resolveBossTurn(prepared,target.player,target.bossOrigin):undefined;
}
