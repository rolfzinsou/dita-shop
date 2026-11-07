'use client';
import { useEffect, useState } from 'react';
const b64=s=>{const r=atob((s+'='.repeat((4-s.length%4)%4)).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from([...r].map(c=>c.charCodeAt(0)));};
const MSG={ios:'Sur iPhone : appuie sur « Partager » puis « Sur l\'écran d\'accueil », et ouvre le site depuis son icône pour activer les rappels.',denied:'Notifications bloquées : autorise-les pour ce site dans les réglages de ton navigateur.',on:'Les rappels sont activés sur cet appareil 🎀'};
export default function PushButton(){
  const [st,set]=useState('init'),[tip,setTip]=useState(false);
  useEffect(()=>{
    const ios=/iphone|ipad|ipod/i.test(navigator.userAgent),app=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
    if(ios&&!app)return set('ios');
    if(!('serviceWorker' in navigator)||!('PushManager' in window))return set('no');
    if(Notification.permission==='denied')return set('denied');
    if(Notification.permission==='default')return set('off');
    navigator.serviceWorker.getRegistration('/sw.js').then(async r=>set((await r?.pushManager.getSubscription())?'on':'off')).catch(()=>set('off'));
  },[]);
  async function on(){
    try{
      const reg=await navigator.serviceWorker.register('/sw.js');
      if(await Notification.requestPermission()!=='granted')return set('denied');
      const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)});
      const r=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(sub)});
      set(r.ok?'on':'off');
    }catch{set('off');}
  }
  if(st==='init'||st==='no')return null;
  return(<div className="pushw"><button type="button" className="bell" onClick={()=>st==='off'?on():setTip(t=>!t)}>🔔<span>{st==='on'?'Activé ✓':'Me prévenir'}</span></button>{tip&&MSG[st]&&<p className="pop">{MSG[st]}</p>}</div>);
}
