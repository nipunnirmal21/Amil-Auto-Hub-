import test from 'node:test';
import assert from 'node:assert/strict';
import { billboardLabel, billboardNavigation } from './billboardNavigation.js';

test('billboard navigation moves older and newer without wrapping', () => {
  assert.deepEqual(billboardNavigation(0, 3), {
    showNavigation: true,
    atNewest: true,
    atOldest: false,
    olderIndex: 1,
    newerIndex: 0,
  });
  assert.deepEqual(billboardNavigation(2, 3), {
    showNavigation: true,
    atNewest: false,
    atOldest: true,
    olderIndex: 2,
    newerIndex: 1,
  });
});

test('single-board navigation is hidden and bounded', () => {
  assert.deepEqual(billboardNavigation(0, 1), {
    showNavigation: false,
    atNewest: true,
    atOldest: true,
    olderIndex: 0,
    newerIndex: 0,
  });
});

test('only the current board uses the Today label', () => {
  assert.equal(billboardLabel({ active: true }), "Today's Board");
  assert.equal(billboardLabel({ active: false }), 'Previous Board');
});
