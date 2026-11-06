import { admin } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { sendNotif } from './../actions';
export const dynamic='force-dynamic';
export default async function Page({searchParams}){
  if(!isAdmin())return null;
  const {count}=await admin().from('push_subscriptions').select('*',{count:'exact',head:true});
  return(<><h1 style={{marginBottom:14}}>Notifications</h1>
    <div className="card"><b>{count||0} abonnée{count>1?'s':''}</b><small>Envoyées automatiquement : à chaque nouveau produit, à chaque nouvelle promo (si la case est cochée dans le formulaire produit), et les rappels des jours spéciaux (2 jours avant, la veille, le jour même).</small></div>
    {searchParams.sent&&<p className="ok" style={{marginBottom:10}}>Envoyée à {searchParams.sent} appareil(s).</p>}
    <form action={sendNotif} className="card"><b>Envoyer une notification maintenant</b><input name="title" placeholder="Titre" maxLength={60} required/><input name="body" placeholder="Message" maxLength={160} required/><button className="btn">Envoyer à toutes</button></form></>);
}
