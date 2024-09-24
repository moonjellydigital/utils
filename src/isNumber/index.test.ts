import { isNumber } from '.';
import { describe, test, expect } from 'vitest';

describe('isNumber', () => {
  class AnotherNumber extends Number {}

  test.each([
    [0, true],
    [42, true],
    [Object(0), true],
    [new Number(0), true],
    [new AnotherNumber(42), true],
    [Number(1n), true],
    [NaN, true],
    [+Infinity, true],
    [-Infinity, true],
  ])(
    'should return true for number primitives and Number objects',
    (val, expected) => {
      expect(isNumber(val)).toBe(expected);
    },
  );

  test.each([
    [5n, false],
    [undefined, false],
    [null, false],
    [true, false],
    [Symbol('foo'), false],
    [{ a: 'bar' }, false],
    [['a', 'b'], false],
    [new Error('test'), false],
    [new Date(), false],
    [/x/, false],
    ['str', false],
  ])('should return false for non-number values', (val, expected) => {
    expect(isNumber(val)).toBe(expected);
  });
});
