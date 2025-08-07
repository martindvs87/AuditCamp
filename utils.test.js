import test from 'node:test';
import assert from 'node:assert';
import { splitTextIntoSegments } from './utils.js';

test('splitTextIntoSegments splits on blank lines', () => {
  const input = 'A\n\nB\n\n\nC';
  const segments = splitTextIntoSegments(input);
  assert.deepStrictEqual(segments, ['A', 'B', 'C']);
});
