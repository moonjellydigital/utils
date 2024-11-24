import { compact } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('compact', () => {
  test('should return a TypeError if argument is not an array-like', () => {
    const result = compact(42 as unknown as ArrayLike<unknown>) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([42]);
  });

  test('should not mutate the original argument', () => {
    const arg = [1, 0, null, '42', 7, { name: 'Rob' }];
    const argCopy = structuredClone(arg);
    compact(arg);
    expect(arg).toStrictEqual(argCopy);
  });

  test('should make a shallow copy of object elements', () => {
    const arg = [{ name: 'Bob' }, null, { name: 'Cindy' }, { name: 'Keiko' }];
    const result = compact(arg) as object[];
    expect(result[0]).toBe(arg[0]);
    expect(result[1]).toBe(arg[2]);
    expect(result[2]).toBe(arg[3]);
  });

  test.each([
    [
      [0, 1, NaN, , 2, false, 3, true, 4, '', undefined, 5, null], // eslint-disable-line no-sparse-arrays
      [1, 2, 3, true, 4, 5],
    ],
    ['string ', ['s', 't', 'r', 'i', 'n', 'g', ' ']],
    [new String(' string'), [' ', 's', 't', 'r', 'i', 'n', 'g']],
    ['', []],
    [
      { 0: 1, 1: null, 2: 3, 3: false, 4: undefined, 5: 7, length: 6 },
      [1, 3, 7],
    ],
  ])('compact(%s) should return %s', (arr, expected) => {
    expect(compact(arr)).toStrictEqual(expected);
  });
});
