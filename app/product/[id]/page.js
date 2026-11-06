import { notFound } from 'next/navigation';
import Link from 'next/link';
import { pub } from '@/lib/supabase';
import { daysOf, okToday, nextDay, label, JOURS } from '@/lib/dispo';
import { wa } from '@/lib/wa';
import Gallery from '@/components/Gallery';
export const dynamic='force-dynamic';
export default async function P({params}){
  const db=pub(),{data:p}=await db.from('products').select('*').eq('id',+params.id).maybeSingle();
  if(!p)notFound();
  const {data:c}=p.category_id?await db.from('categories').select('*').eq('id',p.category_id).maybeSingle():{data:null};
  const d=daysOf(p,c),ok=okToday(d),n=d.length?nextDay(d):null;
  return(<main className="wrap"><Link href="/" style={{color:'var(--mut)',fontSize:14}}>← Retour</Link>
    <div className="detail" style={{marginTop:14}}>
      <Gallery photos={p.photos} alt={p.name}/>
      <div><h1 className="ptitle">{p.name}</h1>
        <p className="pr" style={{fontSize:26,margin:'8px 0'}}>{(p.promo_price??p.price).toLocaleString('fr-FR')} FCFA{p.promo_price!=null&&<s>{p.price.toLocaleString('fr-FR')}</s>}</p>
        <p style={{margin:'8px 0 14px',lineHeight:1.7}}>{c?.name&&<>Catégorie : <b>{c.name}</b><br/></>}Disponibilité : <b>{label(d)}</b>{!ok&&p.in_stock&&<> — prochaine dispo : <b>{JOURS[n.day]}</b></>}</p>
        {p.description&&<p style={{margin:'12px 0 18px',lineHeight:1.7,whiteSpace:'pre-line'}}>{p.description}</p>}
        {p.in_stock?<a className="btn" href={wa(p,d,ok)} target="_blank" rel="noopener">{ok?'Commander sur WhatsApp':`Réserver pour ${JOURS[n.day]}`}</a>:<span className="btn o">Rupture de stock</span>}
      </div></div></main>);
}
