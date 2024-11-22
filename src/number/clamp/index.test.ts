import { clamp } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../../types.d.ts';

describe('clamp', () => {
  test('should return a TypeError, including correct ErrData, if n is not of number type', () => {
    const value = <Error>clamp('str' as unknown as number, 5, 20);
    const errData = <ErrData>value.cause;
    expect(value).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual(['str', 5, 20]);
  });

  test('should return a TypeError, including correct ErrData, if lower is not of number type', () => {
    const value = <Error>clamp(5, 'str' as unknown as number, 20);
    const errData = <ErrData>value.cause;
    expect(value).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([5, 'str', 20]);
  });

  test('should return a TypeError, including correct ErrData, if upper is not of number type', () => {
    const value = <Error>clamp(5, 20, 'str' as unknown as number);
    const errData = <ErrData>value.cause;
    expect(value).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([5, 20, 'str']);
  });

  test('should return an Error, including correct ErrData, if n is NaN', () => {
    const value = <Error>clamp(NaN, 5, 20);
    const errData = <ErrData>value.cause;
    expect(value).toBeInstanceOf(Error);
    expect(errData.code).toBe('NaN');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([NaN, 5, 20]);
  });

  test('should return an Error, including correct ErrData, if lower is NaN', () => {
    const value = <Error>clamp(5, NaN, 20);
    const errData = <ErrData>value.cause;
    expect(value).toBeInstanceOf(Error);
    expect(errData.code).toBe('NaN');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([5, NaN, 20]);
  });

  test('should return an Error, including correct ErrData, if upper is NaN', () => {
    const value = <Error>clamp(5, 20, NaN);
    const errData = <ErrData>value.cause;
    expect(value).toBeInstanceOf(Error);
    expect(errData.code).toBe('NaN');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([5, 20, NaN]);
  });

  test('should return a RangeError, including correct ErrData, if lower is greater than upper', () => {
    const value = <Error>clamp(7, 30, 10);
    const errData = <ErrData>value.cause;
    expect(value).toBeInstanceOf(RangeError);
    expect(errData.code).toBe('InvalidRange');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([7, 30, 10]);
  });

  test('should work with Number objects', () => {
    expect(
      clamp(
        new Number(3) as number,
        new Number(0) as number,
        new Number(10) as number,
      ),
    ).toBe(3);
  });

  test.each([
    [0, 1, 10, 1],
    [11, 1, 10, 10],
    [5, 1, 10, 5],
    [-6, -5, 5, -5],
    [6, -5, 5, 5],
    [2, -5, 5, 2],
    [
      Number.MIN_VALUE - 1,
      Number.MIN_VALUE,
      Number.MAX_VALUE,
      Number.MIN_VALUE,
    ],
    [
      Number.MAX_VALUE + 1,
      Number.MIN_VALUE,
      Number.MAX_VALUE,
      Number.MAX_VALUE,
    ],
    [
      Number.MIN_VALUE + 1,
      Number.MIN_VALUE,
      Number.MAX_VALUE,
      Number.MIN_VALUE + 1,
    ],
    [Infinity, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE],
    [-Infinity, -Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE],
  ])('clamp(%s, %s, %s) should return %s', (n, lower, upper, expected) => {
    expect(clamp(n, lower, upper)).toBe(expected);
  });
});
