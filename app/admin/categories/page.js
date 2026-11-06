import { admin } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { JOURS } from '@/lib/dispo';
import Confirm from '@/components/Confirm';
import { saveCategory, delCategory } from './../actions';
export const dynamic='force-dynamic';
const Days=({v=[]})=><div className="days">{JOURS.map((j,i)=><label key={i}><input type="checkbox" name="jours" value={i} defaultChecked={v.includes(i)}/>{j}</label>)}</div>;
export default async function Page(){
  if(!isAdmin())return null;
  const {data:cats=[]}=await admin().from('categories').select('*').order('name');
  return(<><h1 style={{marginBottom:14}}>Catégories</h1>
    <form action={saveCategory} className="card"><b>Nouvelle catégorie</b><input name="name" placeholder="Nom (ex: Plats du vendredi)" required maxLength={40}/><small>Jours de dispo : rien coché = tous les jours</small><Days/><button className="btn">Ajouter</button></form>
    {cats.map(c=><div key={c.id} className="card"><form action={saveCategory} className="card" style={{border:0,padding:0,margin:0}}><input type="hidden" name="id" value={c.id}/><input name="name" defaultValue={c.name} required maxLength={40}/><Days v={c.jours_dispo}/><button className="btn o sm">Enregistrer</button></form>
      <form action={delCategory}><input type="hidden" name="id" value={c.id}/><Confirm msg="Supprimer cette catégorie ? Ses produits resteront, sans catégorie." className="btn r sm">Supprimer</Confirm></form></div>)}
  </>);
}
