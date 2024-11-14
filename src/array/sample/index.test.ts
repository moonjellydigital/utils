import { sample } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('sample', () => {
  test('should return a TypeError if arr is not array-like', () => {
    const arg = new Set() as unknown as ArrayLike<unknown>;
    const result = sample(arg) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([arg]);
  });

  test('should return an Error if the collection is empty', () => {
    const result = sample([]) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(Error);
    expect(errData.code).toBe('EmptyCollection');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([[]]);
  });

  test('should return an Error if the sampled index is an empty slot', () => {
    const result = sample([, , ,]) as Error; // eslint-disable-line no-sparse-arrays
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(Error);
    expect(errData.code).toBe('EmptySlot');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([[, , ,]]); // eslint-disable-line no-sparse-arrays
  });

  test('should not mutate the arr argument', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const argCopy = structuredClone(arg);
    sample(arg);
    expect(arg).toStrictEqual(argCopy);
  });

  test('should return a reference to object elements', () => {
    const arg = [{ name: 'Cindy' }];
    const result = sample(arg) as unknown as object[];
    expect(result).toBe(arg[0]);
  });

  test.each([
    [[0, 1, 2, 3], true],
    ['string', true],
    [{ 0: 'a', 1: 'b', length: 2 }, true],
    [new String('string'), true],
  ])('sample(%s) should be an element in arr', (arg, expected) => {
    const result = sample(arg as unknown as ArrayLike<unknown>);
    expect(Array.prototype.includes.call(arg, result)).toBe(expected);
  });
});
