import webpush from 'web-push';
import { admin } from './supabase';
export async function sendAll(title,body,url='/'){
  webpush.setVapidDetails(process.env.VAPID_SUBJECT,process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,process.env.VAPID_PRIVATE_KEY);
  const db=admin();const {data}=await db.from('push_subscriptions').select('id,data');let n=0;
  await Promise.all((data||[]).map(async s=>{try{await webpush.sendNotification(s.data,JSON.stringify({title,body,url}));n++;}catch(e){if([404,410].includes(e.statusCode))await db.from('push_subscriptions').delete().eq('id',s.id);}}));
  return n;
}
