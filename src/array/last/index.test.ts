import { last } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('last', () => {
  test('should return a TypeError if arr is not array-like', () => {
    const arg = new Set() as unknown as ArrayLike<unknown>;
    const result = last(arg) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([arg]);
  });

  test('should return an Error if the collection is empty', () => {
    const result = last([]) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(Error);
    expect(errData.code).toBe('EmptyCollection');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([[]]);
  });

  test('should return an Error if the last index is an empty slot', () => {
    const result = last([1, ,]) as Error; // eslint-disable-line no-sparse-arrays
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(Error);
    expect(errData.code).toBe('EmptySlot');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([[1, ,]]); // eslint-disable-line no-sparse-arrays
  });

  test('should not mutate the arr argument', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const argCopy = structuredClone(arg);
    last(arg);
    expect(arg).toStrictEqual(argCopy);
  });

  test('should return a reference to object elements', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const result = last(arg) as unknown as object[];
    expect(result).toBe(arg[1]);
  });

  test.each([
    [[0, 1, 2, 3], 3],
    ['string', 'g'],
    [{ 0: 'a', 1: 'b', length: 2 }, 'b'],
    [new String('string'), 'g'],
  ])('last(%s) should return %s', (arg, expected) => {
    expect(last(arg as unknown as ArrayLike<unknown>)).toBe(expected);
  });
});
