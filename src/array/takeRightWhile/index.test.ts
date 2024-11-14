import { takeRightWhile } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('takeRightWhile', () => {
  test('should return a TypeError if arr is not array-like', () => {
    const predicate = (element: number) => element > 3;
    const result = takeRightWhile(
      new Set() as unknown as ArrayLike<number>,
      predicate,
    ) as unknown as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBe(null);
    expect(errData.args).toEqual([new Set(), predicate]);
  });

  test('should return a TypeError if predicate is not of function type', () => {
    const result = takeRightWhile([1, 2, 3], { count: 4 } as unknown as (
      element: unknown,
    ) => boolean) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBe(null);
    expect(errData.args).toEqual([[1, 2, 3], { count: 4 }]);
  });

  test('should take all elements and return an array of all elements if predicate always returns true', () => {
    const result = takeRightWhile([1, 2, 3], (element: number) => element < 5);
    expect(result).toStrictEqual([1, 2, 3]);
  });

  test('should not take any elements if predicate immediately returns false', () => {
    const result = takeRightWhile([1, 2, 3], (element: number) => element > 5);
    expect(result).toStrictEqual([]);
  });

  test('should not mutate the original array', () => {
    const arr = [{ name: 'Cindy' }, { name: 'Bob' }];
    const arrCopy = structuredClone(arr);
    takeRightWhile(arr, (element: unknown) => typeof element === 'object');
    expect(arr).toStrictEqual(arrCopy);
  });

  test('should make a shallow copy of objects inside arr', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const result = takeRightWhile(
      arg,
      (element: unknown) => typeof element === 'object',
    ) as object[];
    expect(result[0]).toBe(arg[0]);
    expect(result[1]).toBe(arg[1]);
    expect(result).not.toBe(arg);
  });

  test.each([
    [
      { 0: 'a', 2: 'b', 3: 'c', length: 4 },
      (element: string) => element > 'a' || element === undefined,
      [, 'b', 'c'], // eslint-disable-line no-sparse-arrays
    ],
    [[5, 3, 2, , 1], (element: number) => element < 5, [1]], // eslint-disable-line no-sparse-arrays
    ['--0005', (element: string) => element !== '-', ['0', '0', '0', '5']],
    [
      String('--0005'),
      (element: string) => element !== '-',
      ['0', '0', '0', '5'],
    ],
  ])('takeRightWhile(%s, %s) should equal %s', (arg1, arg2, expected) => {
    expect(
      takeRightWhile(
        arg1 as ArrayLike<unknown>,
        arg2 as (
          element: unknown,
          index?: number,
          arr?: ArrayLike<unknown>,
        ) => boolean,
      ),
    ).toStrictEqual(expected);
  });
});
