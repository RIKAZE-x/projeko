'use client';

import { useState } from 'react';

const HEROES = [
  { name: 'Aren', role: 'Blade Warden', icon: '⚔️', stats: { STR: 18, DEX: 14, INT: 8, VIT: 17 } },
  { name: 'Lyra', role: 'Astral Mage', icon: '🔮', stats: { STR: 7, DEX: 13, INT: 20, VIT: 11 } },
  { name: 'Kael', role: 'Night Ranger', icon: '🏹', stats: { STR: 12, DEX: 20, INT: 12, VIT: 13 } },
];
const ENEMIES = [
  { name: 'Grave Wisp', hp: 54, max: 54, armor: 4, reward: 42, icon: '👻' },
  { name: 'Ashfang', hp: 76, max: 76, armor: 7, reward: 61, icon: '🐺' },
  { name: 'Hollow Knight', hp: 110, max: 110, armor: 12, reward: 110, icon: '💀' },
];
const QUESTS = [['The Ashen Bell','Investigate the bell tower beneath Emberfall.',120],['Wolves of Greyfen','Clear the corrupted wolf den.',85],['Letters Never Sent','Find the missing courier near the old road.',60]];

export default function Home() {
  const [heroIndex,setHeroIndex]=useState(0), [hp,setHp]=useState(92), [mana,setMana]=useState(61), [gold,setGold]=useState(340), [xp,setXp]=useState(420), [level,setLevel]=useState(7), [enemy,setEnemy]=useState(ENEMIES[0]);
  const [logs,setLogs]=useState([{text:'A cold wind rolls through Emberfall. Something ancient has awakened.',tone:'story'},{text:'Quest accepted: The Ashen Bell.',tone:'quest'}]);
  const [tab,setTab]=useState('quests'), [prompt,setPrompt]=useState(''), [oracle,setOracle]=useState('Ask the Oracle for lore, a quest hook, or tactical advice.'), [busy,setBusy]=useState(false);
  const hero=HEROES[heroIndex], location=['Emberfall — Lower Ward','Emberfall — Astral Library','Greyfen — Moonlit Trail'][heroIndex];
  const log=(text,tone='')=>setLogs(v=>[{text,tone},...v].slice(0,9));
  const attack=()=>{const dmg=Math.max(5,hero.stats.STR+Math.floor(Math.random()*10)-enemy.armor),ret=Math.floor(Math.random()*10)+3,next=Math.max(0,enemy.hp-dmg);setEnemy({...enemy,hp:next});setHp(v=>Math.max(0,v-ret));log(`${hero.name} strikes ${enemy.name} for ${dmg} damage. Retaliation: ${ret}.`,'combat');if(next===0){const n=xp+enemy.reward;setGold(v=>v+Math.floor(enemy.reward*.7));setXp(n>=600?n-600:n);if(n>=600)setLevel(v=>v+1);log(`${enemy.name} defeated. +${enemy.reward} XP and loot recovered.`,'loot');setTimeout(()=>setEnemy(ENEMIES[Math.floor(Math.random()*ENEMIES.length)]),450);}};
  const ability=()=>{if(mana<18)return log('Not enough mana.','warning');const dmg=hero.stats.INT+16;setMana(v=>v-18);setEnemy(e=>({...e,hp:Math.max(0,e.hp-dmg)}));log(`${hero.name} channels an astral technique for ${dmg} damage.`,'magic');};
  const rest=()=>{setHp(v=>Math.min(100,v+28));setMana(v=>Math.min(100,v+30));log('You make camp. Wounds close and mana returns.','rest');};
  const askOracle=async()=>{if(!prompt.trim())return;setBusy(true);try{const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,hero,location,level})});const d=await r.json();setOracle(d.text||'The Oracle is silent.');log('The Oracle answered your question.','magic');}catch{setOracle('The Oracle cannot be reached. Check OPENAI_API_KEY on the server.');}finally{setBusy(false);}};
  return <main className="rpg-shell">
    <header className="topbar"><div className="brand"><span>✦</span><div><b>VEILBOUND</b><small>Chronicles of the Last Flame</small></div></div><div className="top-stats"><span>Day 18</span><span>☾ 23:41</span><span>◈ {gold}</span><span>⚙</span></div></header>
    <section className="hero-strip"><div><span className="eyebrow">CURRENT EXPEDITION</span><h1>{location}</h1><p>Threat level <strong>III</strong> · The veil is unstable tonight.</p></div><div className="party-picker">{HEROES.map((h,i)=><button key={h.name} className={i===heroIndex?'active':''} onClick={()=>setHeroIndex(i)}><span>{h.icon}</span><b>{h.name}</b><small>{h.role}</small></button>)}</div></section>
    <section className="game-grid">
      <aside className="panel character-panel"><div className="portrait">{hero.icon}</div><div className="level">LVL {level}</div><h2>{hero.name}</h2><p className="muted">{hero.role}</p><div className="bars"><label>VITALITY <b>{hp}/100</b></label><div className="bar"><i style={{width:`${hp}%`}}/></div><label>MANA <b>{mana}/100</b></label><div className="bar mana"><i style={{width:`${mana}%`}}/></div><label>EXPERIENCE <b>{xp}/600</b></label><div className="bar xp"><i style={{width:`${Math.min(100,xp/6)}%`}}/></div></div><div className="stat-grid">{Object.entries(hero.stats).map(([k,v])=><div key={k}><b>{v}</b><span>{k}</span></div>)}</div><button className="gold-btn" onClick={rest}>⛺ Make Camp</button></aside>
      <section className="center-column"><div className="panel combat-panel"><div className="panel-title"><span>ENCOUNTER · {enemy.name.toUpperCase()}</span><span>ARMOR {enemy.armor}</span></div><div className="enemy-stage"><div className="rune">◈</div><div className="enemy-icon">{enemy.icon}</div><h2>{enemy.name}</h2><div className="enemy-hp"><i style={{width:`${enemy.hp/enemy.max*100}%`}}/></div><small>{enemy.hp} / {enemy.max} HP</small></div><div className="combat-actions"><button onClick={attack}>⚔ Attack</button><button onClick={ability}>✦ Astral Art <small>18 MP</small></button><button onClick={()=>log('You raise your guard, reducing the next retaliation.','combat')}>🛡 Guard</button></div></div><div className="panel log-panel"><div className="panel-title">CHRONICLE <span>LIVE</span></div>{logs.map((l,i)=><p key={i} className={l.tone}><time>23:{40-i}</time>{l.text}</p>)}</div></section>
      <aside className="panel right-panel"><div className="tabs">{['quests','inventory','lore'].map(t=><button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>{tab==='quests'&&<div className="quest-list">{QUESTS.map(([n,d,r],i)=><article key={n} className={i===0?'selected':''}><span className="quest-icon">{i===0?'◆':i===1?'◈':'◇'}</span><div><b>{n}</b><p>{d}</p><small>+{r} XP</small></div></article>)}</div>}{tab==='inventory'&&<div className="inventory"><div>🗡 Embersteel Longsword <b>×1</b></div><div>🧪 Crimson Tonic <b>×4</b></div><div>💎 Star Shard <b>×7</b></div><div>🛡 Warden's Sigil <b>×1</b></div></div>}{tab==='lore'&&<div className="lore"><h3>The Last Flame</h3><p>Every 1,000 years the Veil thins. The old kingdoms called it the Ashen Cycle; scholars now know it as a living intelligence.</p><p>Someone is ringing the forbidden bell beneath Emberfall.</p></div>}<div className="oracle"><div className="oracle-head">✦ ORACLE <span>AI</span></div><p>{oracle}</p><div className="oracle-input"><input value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>e.key==='Enter'&&askOracle()} placeholder="Ask about the world..."/><button disabled={busy} onClick={askOracle}>{busy?'…':'→'}</button></div></div></aside>
    </section><footer>VEILBOUND RPG · deterministic RPG systems + optional OpenAI narrative intelligence · v0.1</footer>
  </main>;
}
