import { convertStringBool } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../types';

describe('convertStringBool', () => {
  test('should return a TypeError if arg is not a string.', () => {
    const result = convertStringBool(42 as unknown as string) as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(TypeError);
    expect(errData.code).toBe('WrongType');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual([42]);
  });

  test('should return an Error if arg was not string true or false', () => {
    const result = convertStringBool('some string') as Error;
    const errData = result.cause as ErrData;
    expect(result).toBeInstanceOf(RangeError);
    expect(errData.code).toBe('InvalidRange');
    expect(errData.prevErr).toBeNull();
    expect(errData.args).toEqual(['some string']);
  });

  test.each([
    ['true', true],
    [' true', true],
    ['true ', true],
    [' true ', true],
    ['TrUe', true],
    [new String('true') as string, true],
  ])('convertStringBool(%s) should return boolean %s', (value, expected) => {
    expect(convertStringBool(value)).toBe(expected);
  });

  test.each([
    ['false', false],
    [' false', false],
    ['false ', false],
    [' false ', false],
    ['fAlSE', false],
    [new String('false') as string, false],
  ])('convertStringBool(%s) should return boolean %s', (value, expected) => {
    expect(convertStringBool(value)).toBe(expected);
  });

  test.each([
    [true, true],
    [false, false],
    [new Boolean(true), true],
    [new Boolean(false), false],
  ])(
    'convertStringBool(%s) should return %s boolean when value is already boolean type',
    (value, expected) => {
      expect(convertStringBool(value as unknown as string)).toBe(expected);
    },
  );
});
