import { noop } from '.';
import { expect, test } from 'vitest';

test('should return undefined', () => {
  expect(noop()).toBeUndefined();
});
