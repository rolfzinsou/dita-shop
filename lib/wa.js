import { JOURS, nextDay } from './dispo';
export const wa=(p,d,ok)=>`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=${encodeURIComponent(`Bonjour 🧶\nJe voudrais ${ok?'commander':'réserver pour '+JOURS[nextDay(d).day]} : ${p.name} (réf. ${p.id}) à ${(p.promo_price??p.price).toLocaleString('fr-FR')} FCFA.`)}`;
