import { isNullPrototype } from '.';
import { describe, test, expect } from 'vitest';

describe('isNullPrototype', () => {
  test.each([
    [Object.create(null), true],
    [{ __proto__: null }, true],
  ])('isNullPrototype(%s) should return true', (val, expected) => {
    expect(isNullPrototype(val)).toBe(expected);
  });

  test.each([
    ['string', false],
    [42, false],
    [true, false],
    [5n, false],
    [undefined, false],
    [Symbol('foo'), false],
    [new Error('test'), false],
    [{}, false],
  ])('isNullPrototype(%s) should return false', (val, expected) => {
    expect(isNullPrototype(val)).toBe(expected);
  });
});
