import { multiply } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types.d.ts';

describe('multiply', () => {
  test('should return a TypeError if the argument is not an array', () => {
    const result = multiply({} as unknown as number[]) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBe(null);
    expect(errData.args).toEqual([{}]);
  });

  test('should return 0 if the array is empty', () => {
    const result = multiply([] as number[]);
    expect(result).toBe(0);
  });

  test.each([
    [[1, 2, , 3, 4] as number[], 24], // eslint-disable-line no-sparse-arrays
    [[, , , , ,] as unknown as number[], 0], // eslint-disable-line no-sparse-arrays
  ])('should ignore sparse elements', (arg, expected) => {
    expect(multiply(arg)).toBe(expected);
  });

  test.each([
    [[0, 10, {}, 4], 'expected placeholder'],
    [[1, NaN, 4, 7], 'expected placeholder'],
  ])(
    'should return an Error if an element in the array is not a number',
    (arg) => {
      const result = multiply(arg as number[]) as Error;
      const errData = result.cause as ErrData;
      expect(result).toBeInstanceOf(Error);
      expect(errData.code).toBe('NaN');
      expect(errData.prevErr).toBe(null);
      expect(errData.args).toEqual([arg]);
    },
  );

  test.each([
    [[1, 1, Number.MAX_VALUE, 1], Number.MAX_VALUE],
    [[Number.MAX_VALUE], Number.MAX_VALUE],
    [[Infinity, 10], Number.MAX_VALUE],
  ])(
    'should clamp return value to Number.MAX_VALUE if the total is equal to or greater than Number.MAX_VALUE',
    (arg, expected) => {
      expect(multiply(arg)).toBe(expected);
    },
  );

  test.each([
    [[-1, -1, -Number.MAX_VALUE, 1], -Number.MAX_VALUE],
    [[-Number.MAX_VALUE], -Number.MAX_VALUE],
    [[-Infinity, 10], -Number.MAX_VALUE],
  ])(
    'should clamp return value to -Number.MAX_VALUE if the total is equal to or less than Number.MAX_VALUE',
    (arg, expected) => {
      expect(multiply(arg)).toBe(expected);
    },
  );

  test.each([
    [[1, 2, 3, 4], 24],
    [[-1, -2, -3, -4], 24],
    [[-1, 0, 4], -0],
    [[100, -20], -2000],
    [[Number.MAX_VALUE, -1, -1], Number.MAX_VALUE],
    [[Number.MAX_VALUE, -10], -Number.MAX_VALUE],
    [[-Number.MAX_VALUE, 1, 2], -Number.MAX_VALUE],
    [[-Number.MAX_VALUE, -1], Number.MAX_VALUE],
  ])('the product of %s should equal %s', (arg, expected) => {
    expect(multiply(arg)).toBe(expected);
  });

  test('should multiply Number objects', () => {
    const arg = [Number(2), 4, 1, 7, Number(-3), 2, Number(10)];
    expect(multiply(arg)).toBe(-3360);
  });
});
