import { isNonNullObject } from '.';
import { describe, test, expect } from 'vitest';

describe('isNonNullObject', () => {
  test('should return false if value is null', () => {
    expect(isNonNullObject(null)).toBe(false);
  });

  test.each([
    [{}, true],
    [new Error('test'), true],
    [Object.create(null), true],
  ])('isNonNullObject(%s) should return true', (val, expected) => {
    expect(isNonNullObject(val)).toBe(expected);
  });

  test.each([
    ['string', false],
    [42, false],
    [true, false],
    [5n, false],
    [undefined, false],
    [Symbol('foo'), false],
  ])('isNonNullObject(%s) should return false', (val, expected) => {
    expect(isNonNullObject(val)).toBe(expected);
  });
});
