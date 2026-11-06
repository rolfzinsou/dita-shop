import { pub } from '@/lib/supabase';
import { sendAll } from '@/lib/push';
import { JOURS, nextDay } from '@/lib/dispo';
export const dynamic='force-dynamic';
export async function GET(req){
  if(!process.env.CRON_SECRET||req.headers.get('authorization')!==`Bearer ${process.env.CRON_SECRET}`)return new Response('no',{status:401});
  const db=pub(),[{data:cats=[]},{data:prods=[]}]=await Promise.all([db.from('categories').select('name,jours_dispo'),db.from('products').select('name,jours_dispo').eq('in_stock',true)]);
  const g=new Map();
  for(const e of [...cats,...prods.filter(p=>p.jours_dispo.length)].filter(e=>e.jours_dispo.length)){
    const n=nextDay(e.jours_dispo);if(n.in>2)continue;
    const k=`${n.in}|${n.day}`;g.set(k,[...(g.get(k)||[]),e.name]);
  }
  let sent=0;
  for(const [k,names] of g){
    const [i,d]=k.split('|').map(Number),j=JOURS[d],l=names.slice(0,3).join(', ')+(names.length>3?'…':'');
    if(i===2)sent+=await sendAll(`Bientôt ${j} 🌸`,`${l} — t'attends quoi pour réserver ?`);
    if(i===1)sent+=await sendAll('C\'est demain ! 🎀',`${l} : dispo demain, réserve dès maintenant.`);
    if(i===0)sent+=await sendAll('C\'est aujourd\'hui ! 🧶',`${l} : dispo aujourd'hui, commande avant que ça parte.`);
  }
  return Response.json({sent});
}
