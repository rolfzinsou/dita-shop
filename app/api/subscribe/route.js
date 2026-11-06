import { admin } from '@/lib/supabase';
export async function POST(req){
  const s=await req.json().catch(()=>null);
  if(!s?.endpoint?.startsWith('https://')||!s.keys?.p256dh||!s.keys?.auth||s.endpoint.length>600)return new Response('bad',{status:400});
  const {error}=await admin().from('push_subscriptions').upsert({endpoint:s.endpoint,data:{endpoint:s.endpoint,keys:{p256dh:s.keys.p256dh,auth:s.keys.auth}}},{onConflict:'endpoint'});
  return new Response(error?'err':'ok',{status:error?500:200});
}
