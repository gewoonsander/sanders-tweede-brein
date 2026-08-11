import type { NutritionRange } from '../lib/trackingTypes';

export function FoodNutritionRange({ label, value, unit }: { label: string; value: NutritionRange; unit: string }) {
  const [min, max] = value;
  const text = min == null || max == null ? 'onbekend' : `${Math.round(min)}–${Math.round(max)} ${unit}`;
  return <span className="food-nutrition-range"><span>{label}</span><strong>{text}</strong></span>;
}
