import Link from 'next/link';
import { pub } from '@/lib/supabase';
import { okToday, nextDay, today } from '@/lib/dispo';
import Card from '@/components/Card';
export const dynamic='force-dynamic';
const ORDER=[1,2,3,4,5,6,0],J=['D','L','M','M','J','V','S'];
export default async function Home({searchParams}){
  const db=pub(),q=(searchParams.q||'').toLowerCase().trim(),cat=+searchParams.cat||0;
  const [rc,rp]=await Promise.all([db.from('categories').select('*').order('name'),db.from('products').select('*').order('id',{ascending:false})]);
  if(rc.error||rp.error)return <main className="wrap"><p className="err">Erreur Supabase : {(rc.error||rp.error).message}</p></main>;
  const cats=rc.data,prods=rp.data,by=Object.fromEntries(cats.map(c=>[c.id,c]));
  const list=prods.filter(p=>(!cat||p.category_id===cat)&&(!q||p.name.toLowerCase().includes(q)));
  const spec=cats.filter(c=>c.jours_dispo.length);
  return(<>
    <main className="wrap">
      {spec.length>0&&<div className="panel">{spec.map(c=>{const n=nextDay(c.jours_dispo);return(
        <div key={c.id} className="prow"><div><b>{c.name}</b><small>{okToday(c.jours_dispo)?'Dispo aujourd\'hui !':`Prochaine dispo dans ${n.in} jour${n.in>1?'s':''}`}</small></div>
        <div className="dps">{ORDER.map(i=><i key={i} className={'dp'+(c.jours_dispo.includes(i)?' on':'')+(i===today()?' now':'')}>{J[i]}</i>)}</div></div>);})}
        </div>}
      <form id="creations" className="search"><input name="q" placeholder="Rechercher une création…" defaultValue={searchParams.q||''}/></form>
      <div className="chips"><Link href="/" className={'chip'+(cat?'':' on')}>Tout</Link>{cats.map(c=><Link key={c.id} href={`/?cat=${c.id}`} className={'chip'+(cat===c.id?' on':'')}>{c.name}</Link>)}</div>
      {list.length?<div className="grid">{list.map(p=><Card key={p.id} p={p} c={by[p.category_id]}/>)}</div>:<p>Aucune création pour l'instant. Reviens bientôt !</p>}
    </main></>);
}
