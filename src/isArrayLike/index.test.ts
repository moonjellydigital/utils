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
    ['string primitive', false],
    [new Date(), false],
  ])('should return false for value %s', (arg, expected) => {
    expect(isArrayLike(arg)).toBe(expected);
  });

  test.each([
    [[0, , 0, , 1, 2], true], // eslint-disable-line no-sparse-arrays
    [new String('string object'), true],
    [{ 0: 'a', 1: 'b', length: 2 }, true],
  ])('should return true for value %s', (arg, expected) => {
    expect(isArrayLike(arg)).toBe(expected);
  });
});
