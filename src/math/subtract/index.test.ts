import { subtract } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('subtract', () => {
  test('should return a TypeError if arg minuend is not of number type', () => {
    const result = subtract('2' as unknown as number, 4) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual(['2', 4]);
  });

  test('should return a TypeError if arg subtrahend is not of number type', () => {
    const result = subtract(4, '2' as unknown as number) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([4, '2']);
  });

  test('should return an Error if arg minuend is NaN', () => {
    const result = subtract(NaN, 3) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(RangeError);
    expect(errData.code).toBe('NaN');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([NaN, 3]);
  });

  test('should return an Error if arg subtrahend is NaN', () => {
    const result = subtract(3, NaN) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(RangeError);
    expect(errData.code).toBe('NaN');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([3, NaN]);
  });

  test.each([
    [4, 2, 2],
    [2, 4, -2],
    [-2, -5, 3],
    [-5, -2, -3],
    [3, -2, 5],
    [-2, 3, -5],
    [7, 0, 7],
    [0, 7, -7],
    [
      new Number(10) as unknown as number,
      new Number(8) as unknown as number,
      2,
    ],
    [
      new Number(8) as unknown as number,
      new Number(10) as unknown as number,
      -2,
    ],
  ])('subtract(%s, %s) should equal %s', (a, b, expected) => {
    expect(subtract(a, b)).toBe(expected);
  });

  test.each([
    [Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE],
    [-Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE],
    [Infinity, -Number.MAX_VALUE, Number.MAX_VALUE],
    [-Infinity, Number.MAX_VALUE, -Number.MAX_VALUE],
  ])(
    'subtract(%s, %s) should be clamped to -Number.MAX_VALUE to Number.MAX_VALUE, inclusive',
    (a, b, expected) => {
      expect(subtract(a, b)).toBe(expected);
    },
  );
});
