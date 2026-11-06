import Link from 'next/link';
import { isAdmin } from '@/lib/auth';
import { doLogout } from './actions';
import LoginForm from '@/components/LoginForm';
export const metadata={robots:{index:false,follow:false}};
export default function L({children}){
  if(!isAdmin())return <LoginForm/>;
  return(<div className="wrap"><nav className="anav"><Link href="/admin">Produits</Link><Link href="/admin/categories">Catégories</Link><Link href="/admin/notifications">Notifications</Link><Link href="/" target="_blank">Voir le site ↗</Link><form action={doLogout} style={{marginLeft:'auto'}}><button>Déconnexion</button></form></nav>{children}</div>);
}
