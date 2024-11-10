import { sum } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../types';

describe('sum', () => {
  test('should return a TypeError if the argument is not an array', () => {
    const result = sum({} as unknown as number[]) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBe(null);
    expect(errData.args).toEqual([{}]);
  });

  test('should return 0 if the array is empty', () => {
    const result = sum([] as number[]);
    expect(result).toBe(0);
  });

  test.each([
    [[1, 2, , 3, 4] as number[], 10], // eslint-disable-line no-sparse-arrays
    [[, , , , ,] as unknown as number[], 0], // eslint-disable-line no-sparse-arrays
  ])('should ignore sparse elements', (arg, expected) => {
    expect(sum(arg)).toBe(expected);
  });

  test.each([
    [[0, 10, {}, 4], 'expected placeholder'],
    [[1, NaN, 4, 7], 'expected placeholder'],
  ])(
    'should return an Error if an element in the array is not a number',
    (arg) => {
      const result = sum(arg as number[]) as Error;
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
  ])(
    'should return Number.MAX_VALUE if the total is equal to or greater than Number.MAX_VALUE',
    (arg, expected) => {
      expect(sum(arg)).toBe(expected);
    },
  );

  test.each([
    [[-1, -1, -Number.MAX_VALUE, -1], -Number.MAX_VALUE],
    [[-Number.MAX_VALUE], -Number.MAX_VALUE],
  ])(
    'should return -Number.MAX_VALUE if the total is equal to or less than Number.MAX_VALUE',
    (arg, expected) => {
      expect(sum(arg)).toBe(expected);
    },
  );

  test.each([
    [[1, 2, 3, 4], 10],
    [[-1, -2, -3, -4], -10],
    [[-1, 0, 4], 3],
    [[100, -20], 80],
  ])('the sum of %s should equal %s', (arg, expected) => {
    expect(sum(arg)).toBe(expected);
  });
});
