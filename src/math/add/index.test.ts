import { describe, test, expect } from 'vitest';
import { add } from '.';
import type { ErrData } from '../../types';

describe('add', () => {
  test('should return a TypeError if augend is not of number type', () => {
    const result = add({} as unknown as number, 24) as unknown as TypeError;
    const errData = result.cause as unknown as ErrData;
    expect(result instanceof TypeError).toBe(true);
    expect(errData).toMatchObject({
      code: 'WrongType',
      prevErr: null,
      args: [{}, 24],
    });
  });

  test('should return a TypeError if addend is not of number type', () => {
    const result = add(24, {} as unknown as number) as unknown as TypeError;
    const errData = result.cause as unknown as ErrData;
    expect(result instanceof TypeError).toBe(true);
    expect(errData).toMatchObject({
      code: 'WrongType',
      prevErr: null,
      args: [24, {}],
    });
  });

  test('should return a TypeError if both arguments are not of number type', () => {
    const result = add(
      'string1' as unknown as number,
      'string2' as unknown as number,
    ) as unknown as TypeError;
    const errData = result.cause as unknown as ErrData;
    expect(result instanceof TypeError).toBe(true);
    expect(errData).toMatchObject({
      code: 'WrongType',
      prevErr: null,
      args: ['string1', 'string2'],
    });
  });

  test('should return an Error if augend is NaN', () => {
    const result = add(NaN, 12) as unknown as TypeError;
    const errData = result.cause as unknown as ErrData;
    expect(result instanceof Error).toBe(true);
    expect(errData).toMatchObject({
      code: 'NaN',
      prevErr: null,
      args: [NaN, 12],
    });
  });

  test('should return an Error if addend is NaN', () => {
    const result = add(12, NaN) as unknown as TypeError;
    const errData = result.cause as unknown as ErrData;
    expect(result instanceof Error).toBe(true);
    expect(errData).toMatchObject({
      code: 'NaN',
      prevErr: null,
      args: [12, NaN],
    });
  });

  test('should return an Error if both arguments are NaN', () => {
    const result = add(NaN, NaN) as unknown as TypeError;
    const errData = result.cause as unknown as ErrData;
    expect(result instanceof Error).toBe(true);
    expect(errData).toMatchObject({
      code: 'NaN',
      prevErr: null,
      args: [NaN, NaN],
    });
  });

  test('should add Number objects', () => {
    expect(add(Number(4), Number(2))).toBe(6);
  });

  test.each([
    [10, 20, 30],
    [20, 10, 30],
    [-2, 4, 2],
    [4, -2, 2],
    [-8, -12, -20],
    [8, 12, 20],
  ])('add(%s, %s) to return %s', (augend, addend, expected) => {
    expect(add(augend, addend)).toBe(expected);
  });

  test.each([
    [1.2, 3.6, 4.8],
    [1.1, 2, 3.1],
    [4.4, -2.2, 2.2],
    [-2.2, 4.4, 2.2],
    [-8.5, 3.5, -5],
    [3.5, -8.5, -5],
    [-0.4, -0.2, -0.6],
    [0.4, 0.2, 0.6],
  ])('add(%s, %s) to return approximately %s', (augend, addend, expected) => {
    expect(add(augend, addend)).toBeCloseTo(expected);
  });
});
