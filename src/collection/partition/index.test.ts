import { partition } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('partition', () => {
  test('should return a TypeError if arr is not an array-like', () => {
    const predicate = () => true;
    const result = partition(
      new Set() as unknown as ArrayLike<unknown>,
      predicate,
    ) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([new Set(), predicate]);
  });

  test('should return a TypeError if predicate is not a function', () => {
    const result = partition(
      [0, 1, 2, 3],
      '42' as unknown as (value: number) => boolean,
    ) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([[0, 1, 2, 3], '42']);
  });

  test('should not mutate the original array-like', () => {
    const arg = [1, 4, { name: 'Cindy' }, false, { name: 'Bob' }];
    const argCopy = structuredClone(arg);
    partition(arg, (val) => typeof val === 'object');
    expect(arg).toStrictEqual(argCopy);
  });

  test('should shallow copy object elements', () => {
    interface User {
      name: string;
      online: boolean;
    }
    const arg: User[] = [
      { name: 'Cindy', online: true },
      { name: 'Bob', online: true },
      { name: 'Rebecca', online: false },
    ];
    const [online, offline] = partition(
      arg,
      (val: User) => val.online,
    ) as unknown as [User[], User[]];
    expect(online[0]).toBe(arg[0]);
    expect(online[1]).toBe(arg[1]);
    expect(offline[0]).toBe(arg[2]);
  });

  test.each([
    [
      [false, 1, '4', , { name: 'Bob' }, 0n], // eslint-disable-line no-sparse-arrays
      (val: unknown) => typeof val === 'object',
      [[{ name: 'Bob' }], [false, 1, '4', 0n]],
    ],
    [
      [1, 2, 3, 4, 5, 6],
      (val: number) => val < 4,
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
    ],
    [
      [1, 2, 3, 4, 5, 6],
      (_: number, idx: number) => idx < 3,
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
    ],
    [[0], (val: unknown) => typeof val === 'number', [[0], []]],
    [[0], (val: unknown) => typeof val !== 'number', [[], [0]]],
    [[], (val: unknown) => typeof val !== 'number', [[], []]],
    [
      { 0: 'a', 1: 'b', 2: 'c', 3: 'd', length: 4 },
      (val: string) => val < 'c',
      [
        ['a', 'b'],
        ['c', 'd'],
      ],
    ],
    [
      'string',
      (val: string) => val === 's' || val === 't' || val === 'r',
      [
        ['s', 't', 'r'],
        ['i', 'n', 'g'],
      ],
    ],
    [
      'string',
      (_: string, idx: number) => idx < 3,
      [
        ['s', 't', 'r'],
        ['i', 'n', 'g'],
      ],
    ],
    [
      new String('string'),
      (val: string) => val === 's' || val === 't' || val === 'r',
      [
        ['s', 't', 'r'],
        ['i', 'n', 'g'],
      ],
    ],
  ])('partition(%s, %s) should return %s', (arr, predicate, expected) => {
    expect(
      partition(arr, predicate as (value: unknown) => boolean),
    ).toStrictEqual(expected);
  });
});
