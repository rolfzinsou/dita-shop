'use server';
import crypto from 'crypto';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { admin } from '@/lib/supabase';
import { isAdmin, login, logout } from '@/lib/auth';
import { sendAll } from '@/lib/push';
import { SITE } from '@/lib/site';
const need=()=>{if(!isAdmin())throw new Error('401');};
const days=f=>[...new Set(f.getAll('jours').map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<=6))];
const done=()=>{revalidatePath('/admin','layout');revalidatePath('/');};
const s=(v,m)=>String(v||'').trim().slice(0,m);
const fcfa=n=>n.toLocaleString('fr-FR')+' FCFA';
async function up(db,f){
  if(!f||!f.size)return{error:'fichier vide'};
  if(!['image/jpeg','image/png','image/webp'].includes(f.type))return{error:'format non supporté'};
  if(f.size>3*1024*1024)return{error:'photo trop lourde'};
  const n=`${crypto.randomUUID()}.${f.type.split('/')[1]}`;
  const {error}=await db.storage.from('products').upload(n,Buffer.from(await f.arrayBuffer()),{contentType:f.type});
  return error?{error:error.message}:{url:db.storage.from('products').getPublicUrl(n).data.publicUrl};
}
const names=urls=>urls.map(u=>u.split('/').pop());
export async function doLogin(_,f){if(login(s(f.get('pw'),200)))redirect('/admin');return{error:'Mot de passe incorrect (ou trop d\'essais).'};}
export async function doLogout(){logout();redirect('/admin');}
export async function saveCategory(f){need();const id=+f.get('id')||null,name=s(f.get('name'),40);if(!name)return;const row={name,jours_dispo:days(f)};await(id?admin().from('categories').update(row).eq('id',id):admin().from('categories').insert(row));done();}
export async function delCategory(f){need();await admin().from('categories').delete().eq('id',+f.get('id'));done();}
export async function toggleStock(f){need();await admin().from('products').update({in_stock:f.get('v')!=='true'}).eq('id',+f.get('id'));done();}
export async function delProduct(f){
  need();const db=admin(),id=+f.get('id'),{data}=await db.from('products').select('photos').eq('id',id).maybeSingle();
  await db.from('products').delete().eq('id',id);
  if(data?.photos?.length)await db.storage.from('products').remove(names(data.photos));
  done();
}
export async function saveProduct(f){
  need();const db=admin(),id=+f.get('id')||null,name=s(f.get('name'),120),price=Math.round(+f.get('price'));
  if(!name||!(price>=0))return{error:'Le nom et le prix sont obligatoires.'};
  const pr=f.get('promo'),promo=pr?Math.round(+pr):null;
  if(promo!==null&&!(promo>=0&&promo<price))return{error:'Le prix promo doit être inférieur au prix normal.'};
  let order=[];try{order=JSON.parse(f.get('order')||'[]').slice(0,6);}catch{}
  let old=[],oldPromo=null;
  if(id){const {data}=await db.from('products').select('photos,promo_price').eq('id',id).maybeSingle();if(!data)return{error:'Produit introuvable.'};old=data.photos;oldPromo=data.promo_price;}
  const photos=[];
  for(const o of order){
    if(o.t==='u'){if(old.includes(o.url))photos.push(o.url);}
    else{const r=await up(db,f.get('n'+o.i));if(r.error)return{error:'Photo refusée : '+r.error+' (vérifie que le bucket « products » existe et est public dans Supabase Storage).'};photos.push(r.url);}
  }
  const row={name,description:s(f.get('description'),2000),price,promo_price:promo,category_id:+f.get('category')||null,jours_dispo:days(f),in_stock:f.get('in_stock')==='on',photos};
  const {data,error}=await(id?db.from('products').update(row).eq('id',id):db.from('products').insert(row)).select('id').single();
  if(error)return{error:error.message};
  const gone=old.filter(u=>!photos.includes(u));if(gone.length)await db.storage.from('products').remove(names(gone));
  if(f.get('notify')==='on'&&row.in_stock){
    try{
      if(!id)await sendAll(`Nouveau chez ${SITE.name} ${SITE.emoji}`,`${name} — ${fcfa(promo??price)}`,`/product/${data.id}`);
      else if(promo!==null&&oldPromo===null)await sendAll('Promo 🎀',`${name} passe à ${fcfa(promo)}`,`/product/${data.id}`);
    }catch{}
  }
  done();return{ok:true};
}
export async function sendNotif(f){
  need();const t=s(f.get('title'),60),b=s(f.get('body'),160);if(!t||!b)redirect('/admin/notifications');
  redirect(`/admin/notifications?sent=${await sendAll(t,b)}`);
}
