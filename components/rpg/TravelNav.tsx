'use client';
import { useRouter } from 'next/navigation';
import type { GameState } from '../../lib/rpg/types';
import { storeTravelState } from '../../lib/rpg/travel';
export function TravelNav({state}:{state:GameState}){const router=useRouter();function go(path:string,location:string){storeTravelState({...state,location,logs:[`Travelled to ${location}.`,...state.logs].slice(0,20)});router.push(path)}return <div className="travel-nav"><button onClick={()=>go('/town','Valerion')}>Valerion</button><button onClick={()=>go('/world','Emberfall Region')}>World Map</button><button onClick={()=>go('/game',state.location)}>Return to Dungeon</button></div>}
