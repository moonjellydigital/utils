import { chunk } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('chunk', () => {
  test('should return a TypeError if arr is not an array', () => {
    const result = chunk(24 as unknown as [], 3) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBe(null);
    expect(errData.args).toEqual([24, 3]);
  });

  test('should return a TypeError if size is not of number type', () => {
    const result = chunk([1, 2, 3, 4], 'str' as unknown as number) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBe(null);
    expect(errData.args).toEqual([[1, 2, 3, 4], 'str']);
  });

  test.each([
    [[1, 2, 3, 4], NaN, 'expected placeholder'],
    [[1, 2, 3, 4], 2.05, 'expected placeholder'],
    [[1, 2, 3, 4], -3, 'expected placeholder'],
    [[1, 2, 3, 4], 0, 'expected placeholder'],
  ])(
    'should return a RangeError if size is not an integer greater than 0',
    (arg1, arg2) => {
      const result = chunk(arg1, arg2) as Error;
      const errData = result.cause as ErrData;
      expect(result).toBeInstanceOf(RangeError);
      expect(errData.code).toBe('InvalidRange');
      expect(errData.prevErr).toBe(null);
      expect(errData.args).toEqual([arg1, arg2]);
    },
  );

  test('should return [] if arr has length 0', () => {
    expect(chunk([], 2)).toEqual([]);
  });

  test('should make a shallow copy of elements in the arr argument', () => {
    const arr = [{ name: 'Bob' }, { name: 'Cindy' }, { name: 'Rebecca' }];
    const result = chunk(arr, 1) as unknown as object[][];
    expect(result[0][0]).toBe(arr[0]);
    expect(result[1][0]).toBe(arr[1]);
    expect(result[2][0]).toBe(arr[2]);
  });

  test('should not mutate the arr argument', () => {
    const arr = [{ name: 'Bob' }, { name: 'Cindy' }, { name: 'Rebecca' }];
    const arrCopy = structuredClone(arr);
    chunk(arr, 1) as unknown as object[][];
    expect(arr).toStrictEqual(arrCopy);
  });

  test.each([
    [
      [1, 2, 3, 4],
      2,
      [
        [1, 2],
        [3, 4],
      ],
    ],
    [[1, 2, 3, 4, 5], 2, [[1, 2], [3, 4], [5]]],
    [
      [0, 4, 8, 7, -9, 10, 0, -11],
      3,
      [
        [0, 4, 8],
        [7, -9, 10],
        [0, -11],
      ],
    ],
    [[0, , 4, 5, ,], 2, [[0, ,], [4, 5], [,]]], // eslint-disable-line no-sparse-arrays
    [[2, 4, 6], 3, [[2, 4, 6]]],
  ])('chunk(%s, %s) should equal %s', (arg1, arg2, expected) => {
    expect(chunk(arg1, arg2)).toStrictEqual(expected);
  });
});
