import { isArrayLike } from '.';
import { describe, test, expect } from 'vitest';

describe('isArrayLike', () => {
  test.each([
    [24, false],
    [0n, false],
    [true, false],
    [false, false],
    [Symbol('sym1'), false],
    [{}, false],
    [new Date(), false],
    [{ 0: 'a', 1: 'b', length: NaN }, false],
    [{ 0: 'a', 1: 'b', length: -2 }, false],
    [
      { 0: 'a', 1: 'b', [Number.MAX_VALUE - 1]: 'c', length: Number.MAX_VALUE },
      false,
    ],
  ])('should return false for value %s', (arg, expected) => {
    expect(isArrayLike(arg)).toBe(expected);
  });

  test.each([
    [[], true],
    [[0, , 0, , 1, 2], true], // eslint-disable-line no-sparse-arrays
    ['string primitive', true],
    [new String('string object'), true],
    [{ 0: 'a', 1: 'b', length: 2 }, true],
    [
      {
        0: 'a',
        1: 'b',
        [Number.MAX_SAFE_INTEGER - 1]: 'c',
        length: Number.MAX_SAFE_INTEGER,
      },
      true,
    ],
  ])('should return true for value %s', (arg, expected) => {
    expect(isArrayLike(arg)).toBe(expected);
  });
});
