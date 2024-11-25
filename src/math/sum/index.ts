import { isArrayLike } from '../../language/isArrayLike/index.js';
import { isNumber } from '../../language/isNumber/index.js';
import { isString } from '../../language/isString/index.js';
import { clamp } from '../../number/clamp/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Sums an array-like of numbers.
 *
 * `sum` returns 0 if the length of the array-like is 0, or all the elements are sparse.
 *
 * If the sum is equal to or greater than Number.MAX_VALUE the return value will
 * be clamped to Number.MAX_VALUE. If the sum is equal to or less than -Number.MAX_VALUE
 * the return value will be clamped to -Number.MAX_VALUE. During calculation, `sum`
 * clamps the running total to between -Number.MAX_VALUE and Number.MAX_VALUE inclusive.
 *
 * If `sum` reaches an array element that is NaN or a non-number type it will stop
 * execution and return an `Error`.
 *
 * `sum` can handle sparse arrays. Empty elements will be ignored.
 * @param numbers An array-like of numbers.
 * @returns The sum of the numbers in the array-like, or an Error.
 */
export const sum = (numbers: ArrayLike<number>): number | Error => {
  if (!isArrayLike(numbers) || isString(numbers)) {
    const msg = `Argument numbers must be an array-like of numbers.`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [numbers],
    };
    return new TypeError(msg, { cause: errData });
  }

  if (numbers.length === 0) {
    return 0;
  }

  const len = numbers.length;
  const clampTotal = (current: number) =>
    clamp(current, -Number.MAX_VALUE, Number.MAX_VALUE);
  let total = 0;

  for (let i = 0; i < len; i++) {
    // ignore sparse element
    if (!(i in numbers)) {
      continue;
    }

    if (!isNumber(numbers[i])) {
      const msg = `The element at index ${i} was not of type number. Execution stopped.`;
      const errData: ErrData = {
        code: 'WrongType',
        prevErr: null,
        args: [numbers],
      };
      return new TypeError(msg, { cause: errData });
    }

    if (Number.isNaN(numbers[i].valueOf())) {
      const msg = `The element at index ${i} was NaN. Execution stopped.`;
      const errData: ErrData = {
        code: 'NaN',
        prevErr: null,
        args: [numbers],
      };
      return new Error(msg, { cause: errData });
    }

    total += numbers[i].valueOf();

    const clampedTotal = clampTotal(total);

    if (
      typeof clampedTotal === 'object' &&
      (clampedTotal as unknown) instanceof Error
    ) {
      const msg = `An unknown error has occurred. Execution stopped. This may be a bug in @moonjellydigital/utils.`;
      const errData: ErrData = {
        code: 'UnknownError',
        prevErr: total as unknown as Error,
        args: [numbers],
      };
      return new Error(msg, { cause: errData });
    }

    total = clampedTotal as number;
  }

  return total;
};
