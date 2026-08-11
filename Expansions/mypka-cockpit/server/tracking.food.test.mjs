import test from 'node:test';
import assert from 'node:assert/strict';

test('tracking food API exposes active meals and day totals', async () => {
  const { getTracking } = await import('./tracking.js');
  const data = getTracking();
  assert.ok(Array.isArray(data.food));
  assert.ok(Array.isArray(data.foodDays));
  // The mirror contains Sander's live append-only food log. Its row count grows
  // over time, so test the stable contract rather than yesterday's fixture size.
  assert.ok(data.food.length >= 1);
  assert.ok(data.food.every((row) => row.id != null && Array.isArray(row.kcal)));
  assert.deepEqual(data.food.find((row) => row.date === '2026-08-04')?.kcal, [95, 135]);
});
