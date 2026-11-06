'use client';
import { useFormState } from 'react-dom';
import { doLogin } from '@/app/admin/actions';
export default function LoginForm(){
  const [st,act]=useFormState(doLogin,null);
  return(<main className="wrap narrow"><h1>Espace admin</h1>{st?.error&&<p className="err">{st.error}</p>}
    <form action={act} className="card"><input type="password" name="pw" placeholder="Mot de passe" required autoFocus autoComplete="current-password"/><button className="btn">Se connecter</button></form></main>);
}
