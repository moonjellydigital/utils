import { noop } from '.';
import { describe, expect, test } from 'vitest';

describe('noop', () => {
  test('should return undefined without args', () => {
    expect(noop()).toBeUndefined();
  });

  test('should return undefined with args', () => {
    expect(noop(24, 32)).toBeUndefined();
  });
});
