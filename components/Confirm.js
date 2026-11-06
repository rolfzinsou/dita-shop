'use client';
export default function Confirm({children,msg,className}){return <button className={className} onClick={e=>{if(!confirm(msg))e.preventDefault();}}>{children}</button>;}
