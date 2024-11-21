import { isString } from '.';
import { describe, test, expect } from 'vitest';

describe('isString', () => {
  class AnotherString extends String {}

  test.each([
    ['str', true],
    ['', true],
    [Object('str'), true],
    [new String('str'), true],
    [new AnotherString('str'), true],
  ])(
    'should return true for string primitives and String objects',
    (val, expected) => {
      expect(isString(val)).toBe(expected);
    },
  );

  test.each([
    [42, false],
    [true, false],
    [5n, false],
    [undefined, false],
    [null, false],
    [Symbol('foo'), false],
    [{ a: 'bar' }, false],
    [['a', 'b'], false],
    [new Error('test'), false],
    [new Date(), false],
    [/x/, false],
  ])('should return false for non-string values', (val, expected) => {
    expect(isString(val)).toBe(expected);
  });
});
