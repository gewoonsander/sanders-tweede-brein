import test from 'node:test';
import assert from 'node:assert/strict';

test('tracking food API exposes active meals and day totals', async () => {
  const { getTracking } = await import('./tracking.js');
  const data = getTracking();
  assert.ok(Array.isArray(data.food));
  assert.ok(Array.isArray(data.foodDays));
  assert.equal(data.food.length, 3);
  assert.deepEqual(new Set(data.food.map((row) => row.mealType)), new Set(['breakfast', 'lunch']));
  assert.deepEqual(data.food.find((row) => row.date === '2026-08-04').kcal, [95, 135]);
});
