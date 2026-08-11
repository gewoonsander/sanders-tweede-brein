import { useState } from 'react';
import { Camera, ImageOff, UtensilsCrossed, ArrowUpRight } from 'lucide-react';
import { navigate } from '../lib/router';
import { FoodNutritionRange } from './FoodNutritionRange';
import type { FoodLog } from '../lib/trackingTypes';

const LABEL = { breakfast:'Ontbijt', lunch:'Lunch', dinner:'Avondeten', snack:'Tussendoor' } as const;
function MealPhoto({ path, alt }: { path: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!path || failed) return <div className="food-photo food-photo--empty" aria-hidden="true">
    {path ? <ImageOff size={22}/> : <Camera size={22}/>}<span>{path ? 'foto niet gevonden' : 'geen foto'}</span></div>;
  return <img className="food-photo" src={`/api/cockpit/media?path=${encodeURIComponent(path)}`} alt={alt} loading="lazy" onError={()=>setFailed(true)}/>;
}
function MealCard({ log }: { log: FoodLog }) {
  const meal = log.mealType ? LABEL[log.mealType] : 'Maaltijd';
  return <article className="food-card">
    <div className="food-card-media"><MealPhoto path={log.photoPath} alt={`${meal}: ${log.description ?? ''}`}/></div>
    <div className="food-card-body">
      <div className="food-card-head"><span className="food-meal"><UtensilsCrossed size={14}/>{meal}</span>
        {log.loggedAt && <time className="food-date">{new Date(log.loggedAt).toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit'})}</time>}</div>
      <p className="food-note">{log.description}</p>
      <div className="food-card-nutrition">
        <FoodNutritionRange label="kcal" value={log.kcal} unit="kcal"/><FoodNutritionRange label="E" value={log.proteinG} unit="g"/>
        <FoodNutritionRange label="KH" value={log.carbsG} unit="g"/><FoodNutritionRange label="V" value={log.fatG} unit="g"/>
      </div>
      <p className="food-confidence">Betrouwbaarheid: {log.confidence ?? 'onbekend'} · bron: {log.sourceType ?? 'onbekend'}</p>
      {log.journalSlug && <button type="button" className="food-open" onClick={()=>navigate({name:'note',type:'journal',slug:log.journalSlug!})}>Open logboek <ArrowUpRight size={13}/></button>}
    </div>
  </article>;
}
export function FoodGallery({ logs }: { logs: FoodLog[] }) {
  if (!logs.length) return <div className="food-empty"><Camera size={24}/><p className="food-empty-title">Nog geen maaltijden gelogd</p><p className="food-empty-sub">Foto-, spraak- en tekstregistraties verschijnen hier.</p></div>;
  const byDate = new Map<string,FoodLog[]>(); for (const log of logs) { const key=log.date ?? 'ongedateerd'; byDate.set(key,[...(byDate.get(key)??[]),log]); }
  return <div className="food-timeline">{[...byDate].sort((a,b)=>b[0].localeCompare(a[0])).map(([date,rows])=><section key={date} className="food-day">
    <h4 className="food-day-label">{date}</h4><div className="food-grid">{rows.map(log=><MealCard key={log.id} log={log}/>)}</div></section>)}</div>;
}
