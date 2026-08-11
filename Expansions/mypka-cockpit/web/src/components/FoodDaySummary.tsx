import { CheckCircle2, CircleDashed } from 'lucide-react';
import { FoodNutritionRange } from './FoodNutritionRange';
import type { FoodDay } from '../lib/trackingTypes';

export function FoodDaySummary({ day }: { day: FoodDay }) {
  const today = new Date().toLocaleDateString('sv-SE');
  return <article className="food-day-summary">
    <div className="food-day-summary-head"><div><h4>{day.date === today ? 'Vandaag' : 'Dagoverzicht'}</h4><p>{day.date}</p></div>
      <span className="food-complete">{day.complete ? <CheckCircle2 size={16}/> : <CircleDashed size={16}/>} {day.complete ? 'Compleet bevestigd' : day.complete === false ? 'Onvolledig' : 'Nog niet bevestigd'}</span>
    </div>
    <div className="food-day-nutrition">
      <FoodNutritionRange label="Energie" value={day.kcal} unit="kcal" />
      <FoodNutritionRange label="Eiwit" value={day.proteinG} unit="g" />
      <FoodNutritionRange label="Koolhydraten" value={day.carbsG} unit="g" />
      <FoodNutritionRange label="Vet" value={day.fatG} unit="g" />
    </div>
    {day.kcalMid != null && <p className="food-midpoint">Middenwaarde: {Math.round(day.kcalMid)} kcal · schatting, geen exact getal</p>}
  </article>;
}
