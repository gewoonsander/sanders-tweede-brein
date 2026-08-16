import test from 'node:test';
import assert from 'node:assert/strict';

test('tracking API exposes active daily habits and quantified check-ins', async () => {
  const { getTracking } = await import('./tracking.js');
  const data = getTracking();
  const slugs = new Set(data.habits.map((habit) => habit.slug));

  assert.ok(slugs.has('dagelijks-opdrukken'));
  assert.ok(slugs.has('dagelijks-bewegen'));
  assert.ok(slugs.has('bodylotion-aanbrengen'));
  assert.ok(slugs.has('schimmelcreme-gebruiken'));
  assert.ok(data.habits.every((habit) => Array.isArray(habit.cells)));

  const cream = data.habits.find((habit) => habit.slug === 'schimmelcreme-gebruiken');
  assert.ok(cream.cells.length >= 1);
  assert.ok(cream.cells.every((cell) => 'amount' in cell && 'unit' in cell));
});
