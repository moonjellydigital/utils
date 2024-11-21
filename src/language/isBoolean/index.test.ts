import { isBoolean } from '.';
import { describe, test, expect } from 'vitest';

describe('isBoolean', () => {
  class AnotherBoolean extends Boolean {}

  test.each([
    [true, true],
    [false, true],
    [Object(true), true],
    [Object(false), true],
    [new Boolean(false), true],
    [new AnotherBoolean(true), true],
  ])(
    'should return true for boolean primitives and Boolean objects',
    (val, expected) => {
      expect(isBoolean(val)).toBe(expected);
    },
  );

  test.each([
    [42, false],
    [5n, false],
    [undefined, false],
    [null, false],
    [Symbol('foo'), false],
    [{ a: 'bar' }, false],
    [['a', 'b'], false],
    [new Error('test'), false],
    [new Date(), false],
    [/x/, false],
    ['str', false],
  ])('should return false for non-boolean values', (val, expected) => {
    expect(isBoolean(val)).toBe(expected);
  });
});
