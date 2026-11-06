'use client';
import { useEffect, useState } from 'react';
const b64=s=>{const r=atob((s+'='.repeat((4-s.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...r].map(c=>c.charCodeAt(0)));};
export default function PushButton(){
  const [st,set]=useState('init');
  useEffect(()=>{
    const ios=/iphone|ipad|ipod/i.test(navigator.userAgent),app=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
    if(ios&&!app)return set('ios');
    if(!('serviceWorker' in navigator)||!('PushManager' in window))return set('no');
    set(Notification.permission==='granted'?'on':Notification.permission==='denied'?'denied':'off');
  },[]);
  async function on(){
    try{
      const reg=await navigator.serviceWorker.register('/sw.js');
      if(await Notification.requestPermission()!=='granted')return set('denied');
      const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)});
      await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(sub)});
      set('on');
    }catch{set('no');}
  }
  if(st==='off')return <button className="btn" onClick={on}>🔔 Activer les rappels</button>;
  if(st==='on')return <p className="ok">🔔 Rappels activés</p>;
  if(st==='ios')return <p style={{fontSize:13}}>Pour recevoir les rappels sur iPhone : appuie sur <b>Partager</b> puis <b>Sur l'écran d'accueil</b>, et ouvre ce site depuis l'icône.</p>;
  if(st==='denied')return <p style={{fontSize:13}}>Notifications bloquées : autorise-les dans les réglages du navigateur.</p>;
  return null;
}
