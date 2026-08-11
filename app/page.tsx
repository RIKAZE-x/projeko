'use client';
import { useRouter } from 'next/navigation';
import { MainMenu } from '../components/rpg/MainMenu';
import type { GameState } from '../lib/rpg/types';

export default function Home(){
 const router=useRouter();
 function enter(state:GameState){
  sessionStorage.setItem('veilbound.pendingState',JSON.stringify(state));
  router.push('/game');
 }
 return <main className="rpg-shell"><MainMenu onStart={enter} onContinue={enter}/></main>;
}
