import Link from 'next/link';
import { admin } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { label } from '@/lib/dispo';
import Confirm from '@/components/Confirm';
import { toggleStock, delProduct } from './actions';
export const dynamic='force-dynamic';
export default async function Page(){
  if(!isAdmin())return null;
  const {data:prods=[],error}=await admin().from('products').select('*,categories(name)').order('id',{ascending:false});
  return(<>
    <div className="row sp"><h1>Produits ({prods.length})</h1><Link className="btn sm" href="/admin/produits/new">+ Nouveau produit</Link></div>
    {error&&<p className="err">{error.message}</p>}
    {prods.map(p=><div key={p.id} className="card arow">
      <div className="th">{p.photos[0]?<img src={p.photos[0]} alt=""/>:'🧶'}</div>
      <div className="grow"><b>{p.name}</b><small>{p.categories?.name||'Sans catégorie'} · {(p.promo_price??p.price).toLocaleString('fr-FR')} FCFA · {p.jours_dispo.length?label(p.jours_dispo):'selon catégorie'}</small></div>
      <div className="row"><Link className="btn o sm" href={`/admin/produits/${p.id}`}>Modifier</Link>
        <form action={toggleStock}><input type="hidden" name="id" value={p.id}/><input type="hidden" name="v" value={String(p.in_stock)}/><button className="btn o sm">{p.in_stock?'En stock ✓':'Rupture ✗'}</button></form>
        <form action={delProduct}><input type="hidden" name="id" value={p.id}/><Confirm msg="Supprimer ce produit et ses photos ?" className="btn r sm">Supprimer</Confirm></form></div></div>)}
    {!prods.length&&<p>Aucun produit. Commence par créer une catégorie, puis ajoute ton premier produit.</p>}
  </>);
}
