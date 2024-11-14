import { first } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('first', () => {
  test('should return a TypeError if arr is not array-like', () => {
    const arg = new Set() as unknown as ArrayLike<unknown>;
    const result = first(arg) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([arg]);
  });

  test('should return an Error if the collection is empty', () => {
    const result = first([]) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(Error);
    expect(errData.code).toBe('EmptyCollection');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([[]]);
  });

  test('should return an Error if the 0th index is an empty slot', () => {
    const result = first([, 1]) as Error; // eslint-disable-line no-sparse-arrays
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(Error);
    expect(errData.code).toBe('EmptySlot');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([[, 1]]); // eslint-disable-line no-sparse-arrays
  });

  test('should not mutate the arr argument', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const argCopy = structuredClone(arg);
    first(arg);
    expect(arg).toStrictEqual(argCopy);
  });

  test('should return a reference to object elements', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const result = first(arg) as unknown as object[];
    expect(result).toBe(arg[0]);
  });

  test.each([
    [[0, 1, 2, 3], 0],
    ['string', 's'],
    [{ 0: 'a', 1: 'b', length: 2 }, 'a'],
    [new String('string'), 's'],
  ])('first(%s) should return %s', (arg, expected) => {
    expect(first(arg as unknown as ArrayLike<unknown>)).toBe(expected);
  });
});
