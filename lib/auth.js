import crypto from 'crypto';
import { cookies } from 'next/headers';
const sign=v=>crypto.createHmac('sha256',process.env.SESSION_SECRET||'').update(v).digest('hex');
const check=pw=>{const [s,h]=(process.env.ADMIN_PASSWORD_HASH||':').split(':');if(!s||!h)return false;const a=crypto.scryptSync(pw||'',s,64),b=Buffer.from(h,'hex');return a.length===b.length&&crypto.timingSafeEqual(a,b);};
export function isAdmin(){
  if(!process.env.SESSION_SECRET)return false;
  const [exp,sig]=(cookies().get('dita_admin')?.value||'').split('.');
  if(!sig||Date.now()>+exp)return false;
  const ok=sign(exp);return sig.length===ok.length&&crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(ok));
}
let fails=0,last=0; // freinage simple (mémoire de l'instance)
export function login(pw){
  if(fails>=5&&Date.now()-last<15*60e3)return false;
  if(!check(pw)){fails++;last=Date.now();return false;}
  fails=0;const exp=String(Date.now()+8*3600e3);
  cookies().set('dita_admin',`${exp}.${sign(exp)}`,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:8*3600});
  return true;
}
export const logout=()=>cookies().delete('dita_admin');
