import { tail } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('tail', () => {
  test('should return a TypeError if arr is not array-like', () => {
    const arg = new Set() as unknown as ArrayLike<unknown>;
    const result = tail(arg) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([arg]);
  });

  test('should not mutate the arr argument', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const argCopy = structuredClone(arg);
    tail(arg);
    expect(arg).toStrictEqual(argCopy);
  });

  test('should return a reference to object elements', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const result = tail(arg) as unknown as object[];
    expect(result[0]).toBe(arg[1]);
  });

  test.each([
    [
      [0, 1, 2, 3],
      [1, 2, 3],
    ],
    ['string', ['t', 'r', 'i', 'n', 'g']],
    [{ 0: 'a', 1: 'b', length: 2 }, ['b']],
    [new String('string'), ['t', 'r', 'i', 'n', 'g']],
  ])('tail(%s) should return %s', (arg, expected) => {
    expect(tail(arg as unknown as ArrayLike<unknown>)).toStrictEqual(expected);
  });
});
