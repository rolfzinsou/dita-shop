export const JOURS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
export const today=()=>new Date().getUTCDay(); // Dakar = UTC
export const daysOf=(p,c)=>(p.jours_dispo?.length?p.jours_dispo:c?.jours_dispo)||[];
export const okToday=d=>!d.length||d.includes(today());
export const nextDay=d=>{for(let i=0;i<7;i++){const x=(today()+i)%7;if(d.includes(x))return{day:x,in:i};}};
export const label=d=>d.length?d.map(i=>JOURS[i]).join(', '):'Tous les jours';
