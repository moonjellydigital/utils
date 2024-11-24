import { unsparse } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('unsparse', () => {
  test('should return a TypeError if argument is not array-like', () => {
    const result = unsparse(42 as unknown as ArrayLike<unknown>) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([42]);
  });

  test('should not mutate the original array-like', () => {
    const arr = [{ name: 'Bob' }, { name: 'Cindy' }, , { name: 'Rebecca' }]; // eslint-disable-line no-sparse-arrays

    const copyArr = structuredClone(arr);
    unsparse(arr);
    expect(arr).toStrictEqual(copyArr);
  });

  test('should make shallow copies of object elements', () => {
    const arr = [{ name: 'Bob' }, { name: 'Cindy' }, , { name: 'Rebecca' }]; // eslint-disable-line no-sparse-arrays

    const result = unsparse(arr) as Array<object>;
    expect(result[0]).toBe(arr[0]);
    expect(result[1]).toBe(arr[1]);
    expect(result[2]).toBe(arr[3]);
  });

  test.each([
    [
      [0, 1, , false, 3, '', , 0n, null, undefined], // eslint-disable-line no-sparse-arrays
      [0, 1, false, 3, '', 0n, null, undefined],
    ],
    ['string', ['s', 't', 'r', 'i', 'n', 'g']],
    [new String('string'), ['s', 't', 'r', 'i', 'n', 'g']],
    [{ 0: 'a', 1: 'b', 3: 'c', length: 4 }, ['a', 'b', 'c']],
  ])('unsparse(%s) should return %s', (arr, expected) => {
    expect(unsparse(arr)).toStrictEqual(expected);
  });
});
