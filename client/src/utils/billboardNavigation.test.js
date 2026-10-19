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

test('only the newest uploaded board uses the Today label', () => {
  assert.equal(billboardLabel({ active: false }, 0), "Today's Board");
  assert.equal(billboardLabel({ active: true }, 1), 'Previous Board');
});

test('three uploads navigate C to B to A and back without wrapping', () => {
  const captions = ['C', 'B', 'A'];
  let index = 0;
  index = billboardNavigation(index, captions.length).olderIndex;
  assert.equal(captions[index], 'B');
  index = billboardNavigation(index, captions.length).olderIndex;
  assert.equal(captions[index], 'A');
  assert.equal(billboardNavigation(index, captions.length).atOldest, true);
  index = billboardNavigation(index, captions.length).newerIndex;
  assert.equal(captions[index], 'B');
  index = billboardNavigation(index, captions.length).newerIndex;
  assert.equal(captions[index], 'C');
  assert.equal(billboardNavigation(index, captions.length).atNewest, true);
});
