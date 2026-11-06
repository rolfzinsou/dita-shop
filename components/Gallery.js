'use client';
import { useState, useEffect, useRef } from 'react';
export default function Gallery({photos,alt}){
  const [i,setI]=useState(0),[zoom,setZoom]=useState(false),t=useRef(0),n=photos.length;
  const go=d=>setI(k=>(k+d+n)%n);
  useEffect(()=>{
    if(n<2&&!zoom)return;
    const h=e=>{if(e.key==='ArrowLeft'&&n>1)go(-1);if(e.key==='ArrowRight'&&n>1)go(1);if(e.key==='Escape')setZoom(false);};
    addEventListener('keydown',h);document.body.style.overflow=zoom?'hidden':'';
    return()=>{removeEventListener('keydown',h);document.body.style.overflow='';};
  },[zoom,n]);
  if(!n)return <div className="gal"><div className="gmain" style={{display:'grid',placeItems:'center',fontSize:56}}>🧶</div></div>;
  const Arrows=({s})=>n>1&&<><button type="button" className="ga l" aria-label="Photo précédente" onClick={e=>{s&&e.stopPropagation();go(-1);}}>‹</button><button type="button" className="ga r" aria-label="Photo suivante" onClick={e=>{s&&e.stopPropagation();go(1);}}>›</button></>;
  return(<div className="gal">
    <div className="gmain" onTouchStart={e=>{t.current=e.touches[0].clientX;}} onTouchEnd={e=>{const d=e.changedTouches[0].clientX-t.current;if(n>1&&Math.abs(d)>40)go(d<0?1:-1);}}>
      <img key={i} src={photos[i]} alt={`${alt} — photo ${i+1}`} onClick={()=>setZoom(true)}/>
      <Arrows/>{n>1&&<span className="gc">{i+1} / {n}</span>}
    </div>
    {n>1&&<div className="gth">{photos.map((u,k)=><button type="button" key={u} className={k===i?'on':''} aria-label={`Voir la photo ${k+1}`} onClick={()=>setI(k)}><img src={u} alt=""/></button>)}</div>}
    {zoom&&<div className="lb" onClick={()=>setZoom(false)}><img src={photos[i]} alt={alt} onClick={e=>e.stopPropagation()}/><Arrows s/><button type="button" className="lx" aria-label="Fermer" onClick={()=>setZoom(false)}>✕</button></div>}
  </div>);
}
