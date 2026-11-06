import { notFound } from 'next/navigation';
import { admin } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import ProductForm from '@/components/ProductForm';
export const dynamic='force-dynamic';
export default async function Page({params}){
  if(!isAdmin())return null;
  const db=admin(),isNew=params.id==='new';
  const [{data:cats=[]},{data:p}]=await Promise.all([db.from('categories').select('id,name').order('name'),isNew?{data:null}:db.from('products').select('*').eq('id',+params.id).maybeSingle()]);
  if(!isNew&&!p)notFound();
  return(<><h1 style={{marginBottom:14}}>{isNew?'Nouveau produit':'Modifier le produit'}</h1><ProductForm product={p} cats={cats}/></>);
}
