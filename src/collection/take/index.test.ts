import { take } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('take', () => {
  test('should return a TypeError if arr is not array-like', () => {
    const result = take(new Set() as unknown as ArrayLike<unknown>, 2) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBe(null);
    expect(errData.args).toEqual([new Set(), 2]);
  });

  test('should return a TypeError if n is not of number type', () => {
    const result = take([1, 2, 3], { count: 4 } as unknown as number) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBe(null);
    expect(errData.args).toEqual([[1, 2, 3], { count: 4 }]);
  });

  test.each([
    [[1, 2, 3], NaN, 'expected placeholder'],
    [[1, 2, 3], Number.MAX_VALUE, 'expected placeholder'],
    [[1, 2, 3], -4, 'expected placeholder'],
  ])(
    'should return a RangeError if n is NaN, negative, or not a safe integer',
    (arg1, arg2) => {
      const result = take(arg1, arg2) as Error;
      const errData = result.cause as ErrData;
      expect(result).toBeInstanceOf(RangeError);
      expect(errData.code).toBe('InvalidRange');
      expect(errData.prevErr).toBe(null);
      expect(errData.args).toEqual([arg1, arg2]);
    },
  );

  test('should return all the elements from the original array if n is greater than arr.length', () => {
    const result = take([1, 2, 3], 7);
    expect(result).toStrictEqual([1, 2, 3]);
  });

  test('should not mutate the original array', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const argCopy = structuredClone(arg);
    take(arg, 2);
    expect(arg).toStrictEqual(argCopy);
  });

  test('should make a shallow copy of objects inside arr', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const result = take(arg, 2) as object[];
    expect(result[0]).toBe(arg[0]);
    expect(result[1]).toBe(arg[1]);
    expect(result).not.toBe(arg);
  });

  test.each([
    [{ 0: 'a', 1: 'b', 3: 'c', length: 4 }, 1, ['a']],
    [[1, , 2, 3, 5], new Number(4), [1, , 2, 3]], // eslint-disable-line no-sparse-arrays
    ['string', 2, ['s', 't']],
  ])('take(%s, %s) should equal %s', (arg1, arg2, expected) => {
    expect(take(arg1 as ArrayLike<unknown>, arg2 as number)).toStrictEqual(
      expected,
    );
  });
});
