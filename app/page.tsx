'use client';

import { useMemo, useState } from 'react';
import { aren, kael, lyra, items, monsters, world } from '@/lib/rpg/content';
import { itemPower, qualityBand, resolveAttack, spawnMonster } from '@/lib/rpg/engine';
import type { Character, GameState } from '@/lib/rpg/types';

const characters = [aren, lyra, kael];
const quests = [
  ['The Ashen Bell','Investigate the bell tower beneath Emberfall.',120,'C'],
  ['Wolves of Greyfen','Clear the corrupted wolf den before migration.',85,'D'],
  ['Letters Never Sent','Find the missing courier near the old road.',60,'E'],
];

function initialState(character: Character): GameState {
  return { day:18, hour:23, location:'Emberfall — Lower Ward', character, party:characters, activeMonster:spawnMonster(0), economy:{inflation:2.4,trust:87,prices:{iron:14,mithril:240,manaCrystal:91},treasuryReserves:{gold:900000,mana:72000}}, logs:['The Veil shivers above Emberfall.','Quest accepted: The Ashen Bell.'] };
}

export default function Home() {
  const [heroIndex,setHeroIndex]=useState(0);
  const [state,setState]=useState<GameState>(()=>initialState(characters[0]));
  const [tab,setTab]=useState<'quests'|'inventory'|'skills'|'world'>('quests');
  const [prompt,setPrompt]=useState('');
  const [oracle,setOracle]=useState('Ask the Oracle about lore, tactics, quests, factions, or the consequences of an action.');
  const [busy,setBusy]=useState(false);
  const hero=state.character;
  const monster=state.activeMonster;
  const hp=Math.max(0,100-Math.min(92,monster.attributes.STR*.25));
  const location=state.location;
  const weapon=hero.equipment.find(i=>i.category==='Weapon');
  const selectedItem=items[heroIndex];
  const itemStats=useMemo(()=>({power:itemPower(selectedItem),band:qualityBand(selectedItem.quality)}),[selectedItem]);

  function switchHero(index:number){
    setHeroIndex(index);
    setState(s=>({...s,character:characters[index],location:['Emberfall — Lower Ward','Arclight — Astral Library','Greyfen — Moonlit Trail'][index]}));
  }
  function combat(multiplier=1){ setState(s=>resolveAttack(s,multiplier)); }
  function camp(){ setState(s=>({...s,logs:['You establish a temporary camp. HP, mana and fatigue recover. '+s.logs[0],...s.logs].slice(0,20)})); }
  async function askOracle(){
    if(!prompt.trim()) return;
    setBusy(true);
    try {
      const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,hero,location,level:hero.level,world,monster,economy:state.economy})});
      const d=await r.json(); setOracle(d.text||'The Oracle is silent.'); setState(s=>({...s,logs:['The Oracle answered your question.',...s.logs].slice(0,20)}));
    } catch { setOracle('The Oracle cannot be reached. Configure OPENAI_API_KEY on the server.'); }
    finally { setBusy(false); }
  }

  return <main className="rpg-shell">
    <header className="topbar"><div className="brand"><span>✦</span><div><b>VEILBOUND</b><small>Chronicles of the Last Flame · Systems Build</small></div></div><div className="top-stats"><span>Day {state.day}</span><span>☾ {String(state.hour).padStart(2,'0')}:41</span><span>◈ {hero.gold.toLocaleString()}</span><span>Lv {hero.level}</span></div></header>
    <section className="hero-strip"><div><span className="eyebrow">LIVE WORLD SIMULATION</span><h1>{location}</h1><p>Threat <strong>{monster.rank}</strong> · {world.continents} continents · {world.registeredDungeons.toLocaleString()} registered dungeons · inflation {state.economy.inflation}%</p></div><div className="party-picker">{characters.map((c,i)=><button key={c.id} className={i===heroIndex?'active':''} onClick={()=>switchHero(i)}><span>{i===0?'⚔️':i===1?'🔮':'🏹'}</span><b>{c.name}</b><small>{c.profession.name} · {c.race}</small></button>)}</div></section>

    <section className="game-grid">
      <aside className="panel character-panel"><div className="portrait">{heroIndex===0?'⚔️':heroIndex===1?'🔮':'🏹'}</div><div className="level">LEVEL {hero.level} · {hero.profession.rank}-RANK PROFESSION</div><h2>{hero.name}</h2><p className="muted">{hero.race} · {hero.profession.name}</p><div className="bars"><label>VITALITY <b>{Math.round(100-hp)}/100</b></label><div className="bar"><i style={{width:`${100-hp}%`}}/></div><label>MANA <b>{hero.attributes.MAG * 2}/100</b></label><div className="bar mana"><i style={{width:`${Math.min(100,hero.attributes.MAG*2)}%`}}/></div><label>PROFESSION XP <b>{hero.profession.xp}</b></label><div className="bar xp"><i style={{width:`${Math.min(100,hero.profession.xp/40)}%`}}/></div></div><div className="stat-grid">{Object.entries(hero.attributes).map(([k,v])=><div key={k}><b>{v}</b><span>{k}</span></div>)}</div><button className="gold-btn" onClick={camp}>⛺ Make Camp</button></aside>

      <section className="center-column"><div className="panel combat-panel"><div className="panel-title"><span>ENCOUNTER · {monster.name.toUpperCase()}</span><span>{monster.rank} · THR {monster.attributes.THR}</span></div><div className="enemy-stage"><div className="rune">◈</div><div className="enemy-icon">{monster.rank==='B'?'🐍':monster.rank==='C'?'🐂':'👻'}</div><h2>{monster.name}</h2><p className="muted">Lv {monster.level} · STR {monster.attributes.STR} · VIT {monster.attributes.VIT} · MAG {monster.attributes.MAG}</p><div className="enemy-hp"><i style={{width:`${monster.hp/monster.maxHp*100}%`}}/></div><small>{monster.hp.toLocaleString()} / {monster.maxHp.toLocaleString()} HP</small></div><div className="combat-actions"><button onClick={()=>combat(1)}>⚔ Attack<small>physical calculation</small></button><button onClick={()=>combat(1.65)}>✦ Skill Burst<small>{hero.skills[0]?.name || 'No skill'}</small></button><button onClick={()=>setState(s=>({...s,activeMonster:spawnMonster(),logs:[`A new ${s.activeMonster.rank}-rank threat enters the encounter.`,...s.logs]}))}>♻ Re-roll<small>spawn encounter</small></button></div></div><div className="panel log-panel"><div className="panel-title">CHRONICLE <span>LIVE</span></div>{state.logs.slice(0,9).map((text,i)=><p key={`${text}-${i}`} className={i===0?'combat':''}><time>23:{40-i}</time>{text}</p>)}</div></section>

      <aside className="panel right-panel"><div className="tabs">{(['quests','inventory','skills','world'] as const).map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
        {tab==='quests'&&<div className="quest-list">{quests.map(([name,desc,reward,rank],i)=><article key={name} className={i===0?'selected':''}><span className="quest-icon">{i===0?'◆':i===1?'◈':'◇'}</span><div><b>{name}</b><p>{desc}</p><small>{rank}-Rank · +{reward} XP</small></div></article>)}</div>}
        {tab==='inventory'&&<div className="inventory">{hero.equipment.map(item=><div key={item.id}><b>{item.name}</b><p>{item.category} · {item.rarity} · {item.rank}-Rank · Quality {item.quality}% ({qualityBand(item.quality)})</p><small>Power {itemPower(item)} · Soul {item.soulResonance}% · Condition {item.condition}%</small></div>)}<div><b>Emberfall Supply</b><p>Crimson Tonic ×4 · Star Shard ×7 · Mana Crystal ×12</p></div></div>}
        {tab==='skills'&&<div className="inventory">{hero.skills.map(skill=><div key={skill.id}><b>{skill.name} · {skill.rank}</b><p>Tier {skill.tier} · Level {skill.level} · Mastery {skill.mastery} · Authority {skill.authority}</p><small>{skill.description} · {skill.manaCost} MP</small></div>)}</div>}
        {tab==='world'&&<div className="lore"><h3>World Architecture</h3><p>{world.continents} continents · {world.seas} major seas · {world.majorPowers} major powers.</p><p>{world.zones.slice(0,6).join(' · ')}</p><p>Major currencies: Nim → Sil → Aren → Crown → Imperial Crown → Aureus.</p><p>Grand Treasury trust: {state.economy.trust}/100 · Mana reserves: {state.economy.treasuryReserves.mana.toLocaleString()}.</p><p>Selected weapon: {weapon?.name}. Generated power: {weapon ? itemPower(weapon) : 0}.</p></div>}
        <div className="oracle"><div className="oracle-head">✦ ORACLE <span>OPENAI</span></div><p>{oracle}</p><div className="oracle-input"><input value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&askOracle()} placeholder="Ask the living world..."/><button disabled={busy} onClick={askOracle}>{busy?'…':'→'}</button></div></div>
      </aside>
    </section><footer>VEILBOUND RPG · Item = Base + Quality + Rank + Affix + Trait + Soul + History + Condition · Rank is threat, not guaranteed victory · v0.3</footer>
  </main>;
}
