import { isBigInt } from '.';
import { describe, test, expect } from 'vitest';

describe('isBigInt', () => {
  test.each([
    [Object(1n), true],
    [BigInt(1n), true],
  ])(
    'should return true for bigint primitives and BigInt objects',
    (val, expected) => {
      expect(isBigInt(val)).toBe(expected);
    },
  );

  test.each([
    [42, false],
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
  ])('should return false for non-bigint values', (val, expected) => {
    expect(isBigInt(val)).toBe(expected);
  });
});
