'use client';
import { useEffect } from 'react';
import type { Direction, GridPosition } from '../../lib/rpg/player-movement';

interface Props { position:GridPosition; onMove:(direction:Direction)=>void; }
export function GridPlayer({position,onMove}:Props){
 useEffect(()=>{const handler=(event:KeyboardEvent)=>{const map:Record<string,Direction>={ArrowUp:'up',w:'up',ArrowDown:'down',s:'down',ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right'};const direction=map[event.key];if(direction){event.preventDefault();onMove(direction);}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);},[onMove]);
 return <div aria-label={`Player position ${position.x},${position.y}`} className="grid-player" style={{left:`calc(${position.x} * var(--tile-size, 32px))`,top:`calc(${position.y} * var(--tile-size, 32px))`}}>◆</div>;
}
