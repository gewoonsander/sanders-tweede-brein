// trackingTypes.ts — types mirroring the /api/tracking payload (server/tracking.js).
// Strict; no `any`.

// One heatmap cell. done: 1 = committed hit, 0 = a miss/skip, null = pending/blank.
// The tri-state is preserved end-to-end so the UI can paint a miss softly (never
// alarm-red) and a pending day even softer — Atlas's no-shame streak philosophy.
export interface HabitCell {
  date: string;
  done: 1 | 0 | null;
  amount: number | null;
  unit: string | null;
  note: string | null;
  schema: string | null;
}

export interface HabitStreak {
  current: number;
  totalDone: number;
  committedLogs: number;
  lastAmount: number | null;
  lastUnit: string | null;
  lastDate: string | null;
  daysSinceLast: number | null;
}

export interface HabitTracking {
  slug: string;
  name: string;
  streak: HabitStreak | null; // null when the habit has only pending (null-done) cells
  cells: HabitCell[];
}

export type NutritionRange = [number | null, number | null];
export interface FoodLog {
  id: number;
  date: string | null;
  loggedAt: string | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  description: string | null;
  sourceType: 'photo' | 'audio' | 'text' | null;
  kcal: NutritionRange;
  proteinG: NutritionRange;
  carbsG: NutritionRange;
  fatG: NutritionRange;
  confidence: 'low' | 'medium' | 'high' | null;
  photoPath: string | null;
  journalSlug: string | null;
  supersedesEntryId: string | null;
}
export interface FoodDay {
  date: string;
  kcal: NutritionRange;
  kcalMid: number | null;
  proteinG: NutritionRange;
  carbsG: NutritionRange;
  fatG: NutritionRange;
  complete: boolean | null;
  confirmedAt: string | null;
}

export interface TrackingData {
  habits: HabitTracking[];
  food: FoodLog[];
  foodDays: FoodDay[];
}
