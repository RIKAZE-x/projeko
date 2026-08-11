export type RoomKind = 'Entrance' | 'Combat' | 'Treasure' | 'Puzzle' | 'Elite' | 'Event' | 'Shrine' | 'Boss';
export interface DungeonRoom { id:string; depth:number; kind:RoomKind; danger:number; connections:string[]; rewardTier:number; }
export interface DungeonMap { id:string; seed:number; name:string; rank:string; rooms:DungeonRoom[]; bossRoomId:string; }

function rng(seed:number) { let x = seed | 0; return () => { x = Math.imul(1664525, x) + 1013904223 | 0; return (x >>> 0) / 4294967296; }; }

export function generateDungeon(seed:number, rank='C', roomCount=12):DungeonMap {
  const random=rng(seed); const kinds:RoomKind[]=['Combat','Combat','Treasure','Puzzle','Elite','Event','Shrine'];
  const rooms:DungeonRoom[]=[];
  for(let i=0;i<roomCount;i++) rooms.push({ id:`r-${i}`, depth:i, kind:i===0?'Entrance':i===roomCount-1?'Boss':kinds[Math.floor(random()*kinds.length)], danger:Math.round(10+i*4+random()*20), connections:i>0?[`r-${i-1}`]:[], rewardTier:Math.max(1,Math.floor(i/3)+1) });
  for(let i=1;i<rooms.length;i++) { if(i+1<rooms.length && random()>0.45) rooms[i].connections.push(`r-${i+1}`); if(random()>0.75 && i+2<rooms.length) rooms[i].connections.push(`r-${i+2}`); }
  return { id:`dungeon-${seed}`, seed, name:`Procedural Depth ${Math.abs(seed)%9999}`, rank, rooms, bossRoomId:`r-${roomCount-1}` };
}

export function dungeonEncounter(room:DungeonRoom, seed:number) { return { encounterPower:room.danger + seed%17, elite:room.kind==='Elite', boss:room.kind==='Boss', rewardTier:room.rewardTier + (room.kind==='Treasure'?1:0) }; }
