import type { Recurrence, SavedEvent } from './types';
export const localISO = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const fromISO = (s: string) => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
export const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const daysBetween = (a: Date, b: Date) => Math.round((start(b).getTime()-start(a).getTime()) / 86400000);
export const fmtLong = (d: Date) => new Intl.DateTimeFormat(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(d);
export const fmtShort = (d: Date) => new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(d);
export const isLeap = (y:number) => y%4===0 && (y%100!==0 || y%400===0);
const occurrence = (base: Date, y:number, m:number, day:number, rule:'feb28'|'mar1') => new Date(y, m, m===1 && day===29 && !isLeap(y) ? (rule==='feb28'?28:1) : day);
export function nextOccurrence(e: Pick<SavedEvent,'date'|'recurrence'|'leapRule'>, today=start(new Date())): Date {
 const d=fromISO(e.date); if(e.recurrence==='none') return d;
 if(e.recurrence==='yearly') { let o=occurrence(d,today.getFullYear(),d.getMonth(),d.getDate(),e.leapRule); if(daysBetween(today,o)<0) o=occurrence(d,today.getFullYear()+1,d.getMonth(),d.getDate(),e.leapRule); return o; }
 let y=today.getFullYear(), m=today.getMonth(); let day=Math.min(d.getDate(),new Date(y,m+1,0).getDate()); let o=new Date(y,m,day); if(daysBetween(today,o)<0){m++; if(m===12){m=0;y++;} o=new Date(y,m,Math.min(d.getDate(),new Date(y,m+1,0).getDate()));} return o;
}
export function previousOccurrence(e: Pick<SavedEvent,'date'|'recurrence'|'leapRule'>, next:Date):Date|null { if(e.recurrence==='none') return null; const d=fromISO(e.date); if(e.recurrence==='yearly') return occurrence(d,next.getFullYear()-1,d.getMonth(),d.getDate(),e.leapRule); let y=next.getFullYear(),m=next.getMonth()-1;if(m<0){m=11;y--;}return new Date(y,m,Math.min(d.getDate(),new Date(y,m+1,0).getDate())); }
export function dateDiff(from:Date,to:Date){ let y=to.getFullYear()-from.getFullYear(), m=to.getMonth()-from.getMonth(), d=to.getDate()-from.getDate(); if(d<0){m--; d+=new Date(to.getFullYear(),to.getMonth(),0).getDate();} if(m<0){y--;m+=12;}return {y,m,d}; }
export const recurrenceLabel=(r:Recurrence)=>r==='none'?'One time':r==='yearly'?'Every year':'Every month';
