import { nth } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types';

describe('nth', () => {
  test('should return a TypeError if arr is not array-like', () => {
    const arg = new Set() as unknown as ArrayLike<unknown>;
    const result = nth(arg, 2) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([arg, 2]);
  });

  test('should return a TypeError if index is not of number type', () => {
    const result = nth([0, 1, 2, 3], '2' as unknown as number) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([[0, 1, 2, 3], '2']);
  });

  test('should return an Error if the collection is empty', () => {
    const result = nth([], 0) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(Error);
    expect(errData.code).toBe('EmptyCollection');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([[], 0]);
  });

  test('should return an Error if the nth index is an empty slot', () => {
    const result = nth([1, ,], 1) as Error; // eslint-disable-line no-sparse-arrays
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(Error);
    expect(errData.code).toBe('EmptySlot');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([[1, ,], 1]); // eslint-disable-line no-sparse-arrays
  });

  test('should not mutate the arr argument', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const argCopy = structuredClone(arg);
    nth(arg, 1);
    expect(arg).toStrictEqual(argCopy);
  });

  test('should return a reference to object elements', () => {
    const arg = [{ name: 'Cindy' }, { name: 'Bob' }];
    const result = nth(arg, 1) as unknown as object;
    expect(result).toBe(arg[1]);
  });

  test.each([
    [[0, 1, 2, 3], new Number(3), 3],
    ['string', 2, 'r'],
    [{ 0: 'a', 1: 'b', length: 2 }, 0, 'a'],
    [new String('string'), 3, 'i'],
  ])('nth(%s, %s) should return %s', (arg, index, expected) => {
    expect(
      nth(arg as unknown as ArrayLike<unknown>, index as unknown as number),
    ).toBe(expected);
  });
});
