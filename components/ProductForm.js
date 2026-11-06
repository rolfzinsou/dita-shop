'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveProduct } from '@/app/admin/actions';
import { JOURS } from '@/lib/dispo';
async function shrink(file){
  const b=await createImageBitmap(file),k=Math.min(1,1600/Math.max(b.width,b.height)),c=document.createElement('canvas');
  c.width=Math.round(b.width*k);c.height=Math.round(b.height*k);c.getContext('2d').drawImage(b,0,0,c.width,c.height);
  return new Promise(r=>c.toBlob(x=>r(new File([x],'p.jpg',{type:'image/jpeg'})),'image/jpeg',.82));
}
export default function ProductForm({product:p,cats}){
  const r=useRouter(),[items,setItems]=useState((p?.photos||[]).map(u=>({u,pv:u}))),[cover,setCover]=useState(0),[msg,setMsg]=useState(null),[busy,setBusy]=useState(false);
  const add=e=>{const fs=[...e.target.files].map(f=>({f,pv:URL.createObjectURL(f)}));setItems(a=>[...a,...fs].slice(0,6));e.target.value='';};
  const del=i=>{setItems(a=>a.filter((_,k)=>k!==i));setCover(c=>c===i?0:c>i?c-1:c);};
  async function submit(e){
    e.preventDefault();setBusy(true);setMsg(null);
    try{
      const fd=new FormData(e.target),ord=[items[cover],...items.filter((_,i)=>i!==cover)].filter(Boolean),order=[];let n=0;
      for(const it of ord){if(it.u)order.push({t:'u',url:it.u});else{fd.append('n'+n,await shrink(it.f));order.push({t:'n',i:n++});}}
      fd.set('order',JSON.stringify(order));
      const res=await saveProduct(fd);
      if(res.ok){r.push('/admin');r.refresh();}else{setMsg(res.error);setBusy(false);}
    }catch{setMsg('Une erreur est survenue, réessaie.');setBusy(false);}
  }
  return(<form onSubmit={submit} className="card">
    <input type="hidden" name="id" value={p?.id||''}/>
    <input name="name" placeholder="Nom du produit" defaultValue={p?.name} required maxLength={120}/>
    <div className="row"><input style={{flex:1}} name="price" type="number" min="0" placeholder="Prix (FCFA)" defaultValue={p?.price} required/><input style={{flex:1}} name="promo" type="number" min="0" placeholder="Prix promo (optionnel)" defaultValue={p?.promo_price??''}/></div>
    <select name="category" defaultValue={p?.category_id||''}><option value="">Sans catégorie</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
    <textarea name="description" rows={4} placeholder="Description" defaultValue={p?.description}/>
    <b>Photos <small>(jusqu'à 6 — choisis la couverture)</small></b>
    {items.length>0&&<div className="pgrid">{items.map((it,i)=><div key={it.pv} className={'ph'+(cover===i?' cv':'')}><img src={it.pv} alt=""/>
      <label className="chk"><input type="radio" name="cover" checked={cover===i} onChange={()=>setCover(i)}/>{cover===i?'★ Couverture':'Couverture'}</label>
      <button type="button" className="btn o sm" onClick={()=>del(i)}>Retirer</button></div>)}</div>}
    {items.length<6&&<input type="file" accept="image/*" multiple onChange={add}/>}
    <b>Jours de dispo <small>(rien coché = comme la catégorie, ou tous les jours)</small></b>
    <div className="days">{JOURS.map((j,i)=><label key={i}><input type="checkbox" name="jours" value={i} defaultChecked={p?.jours_dispo?.includes(i)}/>{j}</label>)}</div>
    <label className="chk"><input type="checkbox" name="in_stock" defaultChecked={p?p.in_stock:true}/>En stock</label>
    <label className="chk"><input type="checkbox" name="notify" defaultChecked/>{p?'Prévenir les abonnées si une promo est ajoutée':'Prévenir les abonnées par notification (nouveau produit)'}</label>
    {msg&&<p className="err">{msg}</p>}
    <button className="btn" disabled={busy}>{busy?'Enregistrement…':p?'Enregistrer les modifications':'Ajouter le produit'}</button>
  </form>);
}
