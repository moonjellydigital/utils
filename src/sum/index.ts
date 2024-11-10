import { isNumber } from '../isNumber';
import type { ErrData } from '../types';

/**
 * Sums an array of numbers.
 *
 * Some conditions will cause `sum` to return early. If `sum` reaches an array
 * element that is NaN or a non-number type it will stop execution and return an
 * `Error`. If the running total reaches equal to or greater than Number.MAX_VALUE
 * or equal to or less than -Number.MAX_VALUE, `sum` will stop execution and return
 * Number.MAX_VALUE or -Number.MAX_VALUE as appropriate.
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

    if (total >= Number.MAX_VALUE) {
      return Number.MAX_VALUE;
    }

    if (total <= -Number.MAX_VALUE) {
      return -Number.MAX_VALUE;
    }

    total += numbers[i].valueOf();
  }

  return total;
};
