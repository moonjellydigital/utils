import { isError } from '.';
import { describe, test, expect } from 'vitest';

describe('isError', () => {
  test.each([
    [Symbol('test'), false],
    [42, false],
    [new Error('err'), true],
    ['str', false],
    [{}, false],
    [new TypeError('type err'), true],
    [1n, false],
    [new Set(), false],
    [false, false],
    [true, false],
  ])('isError(%s) to return %s', (value, expected) => {
    expect(isError(value)).toBe(expected);
  });
});
