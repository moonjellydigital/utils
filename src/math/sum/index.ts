import { isNumber } from '../../language/isNumber/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Sums an array of numbers.
 *
 * `sum` returns 0 if the length of the array is 0, or all the elements are sparse.
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
 * @param numbers An array of numbers.
 * @returns The sum of the numbers in the array, or an Error.
 */
export const sum = (numbers: number[]): number | Error => {
  if (!Array.isArray(numbers)) {
    const msg = `Argument numbers must be an array.`;
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
  let total = 0;

  for (let i = 0; i < len; i++) {
    // ignore sparse element
    if (!(i in numbers)) {
      continue;
    }

    if (!isNumber(numbers[i]) || Number.isNaN(numbers[i])) {
      const msg = `The element at index ${i} was not a number. Execution stopped.`;
      const errData: ErrData = {
        code: 'NaN',
        prevErr: null,
        args: [numbers],
      };
      return new Error(msg, { cause: errData });
    }

    total += numbers[i].valueOf();

    if (total >= Number.MAX_VALUE) {
      total = Number.MAX_VALUE;
    }

    if (total <= -Number.MAX_VALUE) {
      total = -Number.MAX_VALUE;
    }
  }

  return total;
};
