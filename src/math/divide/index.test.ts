import { divide } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('divide', () => {
  test('should return a TypeError if arg dividend is not of number type', () => {
    const result = divide('2' as unknown as number, 4) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual(['2', 4]);
  });

  test('should return a TypeError if arg divisor is not of number type', () => {
    const result = divide(4, '2' as unknown as number) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([4, '2']);
  });

  test('should return an Error if arg dividend is NaN', () => {
    const result = divide(NaN, 3) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(RangeError);
    expect(errData.code).toBe('NaN');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([NaN, 3]);
  });

  test('should return an Error if arg divisor is NaN', () => {
    const result = divide(3, NaN) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(RangeError);
    expect(errData.code).toBe('NaN');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([3, NaN]);
  });

  test('should return an Error if divisor argument is 0', () => {
    const result = divide(4, -0) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(RangeError);
    expect(errData.code).toBe('ZeroDivisionError');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([4, -0]);
  });

  test.each([
    [4, 2, 2],
    [2, 4, 0.5],
    [
      new Number(10) as unknown as number,
      new Number(2) as unknown as number,
      5,
    ],
  ])('divide(%s, %s) should equal %s', (a, b, expected) => {
    expect(divide(a, b)).toBe(expected);
  });

  test.each([
    [Number.MAX_VALUE + 1, 1, Number.MAX_VALUE],
    [-Number.MAX_VALUE - 1, 1, -Number.MAX_VALUE],
    [Infinity, 1, Number.MAX_VALUE],
    [-Infinity, 1, -Number.MAX_VALUE],
  ])(
    'divide(%s, %s) should be clamped to -Number.MAX_VALUE to Number.MAX_VALUE, inclusive',
    (a, b, expected) => {
      expect(divide(a, b)).toBe(expected);
    },
  );
});
