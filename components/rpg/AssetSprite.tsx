'use client';
import { useMemo, useState } from 'react';
import { asset } from '../../lib/rpg/asset-registry';

interface Props { id:string; alt?:string; className?:string; pixelated?:boolean; }
export function AssetSprite({id,alt='',className='',pixelated=true}:Props){
 const definition=useMemo(()=>asset(id),[id]);
 const [src,setSrc]=useState(definition?.path);
 if(!definition) return null;
 return <img src={src} alt={alt||id} className={className} onError={()=>definition.fallback&&src!==definition.fallback&&setSrc(definition.fallback)} style={{imageRendering:pixelated?'pixelated':'auto'}} draggable={false}/>;
}
