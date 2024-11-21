import { isNullish } from '.';
import { describe, expect, test } from 'vitest';

describe('isNullish', () => {
  test('should return true if value is undefined', () => {
    expect(isNullish(undefined)).toBe(true);
  });

  test('should return true if value is null', () => {
    expect(isNullish(null)).toBe(true);
  });

  test.each([
    [0, false],
    [-0, false],
    [0n, false],
    [NaN, false],
    ['', false],
    [[], false],
    [{}, false],
    [false, false],
  ])('isNullish(%s) should return false', (val, expected) => {
    expect(isNullish(val)).toBe(expected);
  });
});
