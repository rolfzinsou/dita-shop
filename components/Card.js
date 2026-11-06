import Link from 'next/link';
import { daysOf, okToday, nextDay, JOURS } from '@/lib/dispo';
import { wa } from '@/lib/wa';
export default function Card({p,c}){
  const d=daysOf(p,c),ok=okToday(d),n=d.length?nextDay(d):null;
  return(<div className={'prod'+(p.in_stock?'':' off')}>
    <Link href={`/product/${p.id}`} className="img">
      {p.photos[0]?<img src={p.photos[0]} alt={p.name} loading="lazy"/>:'🧶'}
      {!p.in_stock?<b className="badge red">Rupture</b>:p.promo_price!=null&&<b className="badge">PROMO</b>}
      {p.in_stock&&!ok&&<b className="badge mauve">{JOURS[n.day]}</b>}
    </Link>
    <div className="pb"><h3>{p.name}</h3>
      <div className="pr">{(p.promo_price??p.price).toLocaleString('fr-FR')} FCFA{p.promo_price!=null&&<s>{p.price.toLocaleString('fr-FR')}</s>}</div>
      {p.in_stock?<a className="btn" href={wa(p,d,ok)} target="_blank" rel="noopener">{ok?'Commander':`Réserver pour ${JOURS[n.day]}`}</a>:<span className="btn o">Indisponible</span>}
    </div></div>);
}
