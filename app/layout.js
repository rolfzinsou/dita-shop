import { Great_Vibes, Cormorant_Garamond, Jost } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { SITE } from '@/lib/site';
const fs=Great_Vibes({weight:'400',subsets:['latin'],variable:'--fs'});
const fd=Cormorant_Garamond({weight:['600','700'],subsets:['latin'],variable:'--fd'});
const f=Jost({subsets:['latin'],variable:'--f'});
export const metadata={title:`${SITE.name} — ${SITE.tagline}`,description:SITE.tagline,manifest:'/manifest.json'};
export const viewport={themeColor:'#d97a8b'};
export default function L({children}){return(<html lang="fr"><body className={`${f.variable} ${fd.variable} ${fs.variable}`}>
<header><div className="bar"><Link href="/" style={{display:'flex',alignItems:'center',gap:10}}><img src="/logo.png" alt=""/><span className="gold">{SITE.name}</span></Link></div></header>
{children}
<footer>© {new Date().getFullYear()} {SITE.name} · {SITE.tagline} <br></br> Site By: <Link href="https://cv-rolf.netlify.app" target="_blank" rel="noopener">R~Z, pour tout intéressé par un site cliquez ici</Link></footer>
<a className="fab" href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`} target="_blank" rel="noopener">💬 Aide</a>
</body></html>);}
