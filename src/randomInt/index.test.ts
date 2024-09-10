import type { ErrData } from '../err';
import { randomInt } from '.';
import { describe, test, expect } from 'vitest';

describe('randomInt', () => {
  test('should return a TypeError, including correct ErrData, when Math.ceil(min) is NaN', () => {
    const rand = <Error>randomInt('str' as unknown as number, 4);
    const errData = rand.cause as ErrData;
    expect(rand).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('NaN');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual(['str', 4]);
  });

  test('should return a TypeError, including correct ErrData, when Math.floor(max) is NaN', () => {
    const rand = <Error>randomInt(4, 'str' as unknown as number);
    const errData = rand.cause as ErrData;
    expect(rand).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('NaN');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([4, 'str']);
  });

  test('should return a TypeError, including correct ErrData, when Math.ceil(min) and Math.floor(max) are NaN', () => {
    const rand = <Error>(
      randomInt('str1' as unknown as number, 'str2' as unknown as number)
    );
    const errData = rand.cause as ErrData;
    expect(rand).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('NaN');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual(['str1', 'str2']);
  });

  test('should return a RangeError, including correct ErrData, when Math.ceil(min) and Math.floor(max) are equal', () => {
    const rand = <Error>randomInt(10, 10.2);
    const errData = rand.cause as ErrData;
    expect(rand).toBeInstanceOf(RangeError);
    expect(errData.code).toBe('InvalidRange');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([10, 10.2]);
  });

  test('should return a RangeError, including correct ErrData, when Math.ceil(min) is greater than Math.floor(max)', () => {
    const rand = <Error>randomInt(14, 10);
    const errData = rand.cause as ErrData;
    expect(rand).toBeInstanceOf(RangeError);
    expect(errData.code).toBe('InvalidRange');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([14, 10]);
  });

  test.each([
    [Number.MAX_VALUE, +Infinity, RangeError],
    [Number.MAX_SAFE_INTEGER, Number.MAX_VALUE, RangeError],
    [-Infinity, Number.MIN_SAFE_INTEGER, RangeError],
  ])(
    'randomInt(%d, %d) should return a RangeError, including correct ErrData',
    (min, max, expected) => {
      const rand = <Error>randomInt(min, max);
      const errData = rand.cause as ErrData;
      expect(rand).toBeInstanceOf(expected);
      expect(errData.code).toBe('InvalidRange');
      expect(errData.prevErr).toBeNull();
      expect(errData.args).toEqual([min, max]);
    },
  );

  test.each([
    [-Infinity, +Infinity, true],
    [-Infinity, 3, true],
    [3, +Infinity, true],
    [-Infinity, Number.MIN_VALUE, true],
    [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, true],
    [Number.MIN_SAFE_INTEGER, Number.MAX_VALUE, true],
    [Number.MIN_SAFE_INTEGER, +Infinity, true],
    [Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER, true],
    [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER + 1, true],
  ])(
    'randomInt(%d, %d) should be clamped to the inclusive range of Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER',
    (min, max, expected) => {
      const rand = <number>randomInt(min, max);
      expect(Number.isSafeInteger(rand)).toBe(expected);
    },
  );

  test.each([
    [0, 255, true],
    [1, 10, true],
    [0, 1, true],
    [-1, 0, true],
    [2, 3, true],
    [-360, 0, true],
    [-270, 0, true],
    [-180, 180, true],
    [173437, 6451923, true],
  ])(
    'randomInt(%d, %d) should return an integer in the inclusive range of min to max',
    (min, max, expected) => {
      const rand = <number>randomInt(min, max);
      expect(rand >= min && rand <= max && Number.isInteger(rand)).toBe(
        expected,
      );
    },
  );
});
