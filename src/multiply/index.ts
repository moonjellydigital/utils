import { isNumber } from '../isNumber/index.js';
import type { ErrData } from '../types.d.ts';

/**
 * Multiplies an array of numbers.
 *
 * `multiply` returns 0 if the length of the array is 0, or all the elements are sparse.
 *
 * If the product is equal to or greater than Number.MAX_VALUE the return value will
 * be clamped to Number.MAX_VALUE. If the product is equal to or less than -Number.MAX_VALUE
 * the return value will be clamped to -Number.MAX_VALUE. During calculation, `multiply`
 * clamps the running total to between -Number.MAX_VALUE and Number.MAX_VALUE inclusive.
 *
 * If `multiply` reaches an array element that is NaN or a non-number type it will stop
 * execution and return an `Error`.
 *
 * `multiply` can handle sparse arrays. Empty elements will be ignored.
 * @param numbers An array of numbers.
 * @returns The product of the numbers in the array, or an Error.
 */
export const multiply = (numbers: number[]): number | Error => {
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
  let total = undefined;

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

    if (total === undefined) {
      total = numbers[i].valueOf();
      continue;
    }

    total = (total as number) * numbers[i].valueOf();

    if (total >= Number.MAX_VALUE) {
      total = Number.MAX_VALUE;
    }

    if (total <= -Number.MAX_VALUE) {
      total = -Number.MAX_VALUE;
    }
  }

  return total === undefined ? 0 : total;
};