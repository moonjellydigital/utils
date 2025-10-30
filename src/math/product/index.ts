import { isArrayLike } from '../../language/isArrayLike/index.js';
import { isNumber } from '../../language/isNumber/index.js';
import { isString } from '../../language/isString/index.js';
import { clamp } from '../../number/clamp/index.js';
import type { ErrData } from '../../types.d.ts';
import { isError } from '../../language/isError/index.js';

/**
 * Multiplies an array-like of numbers as a sequence. For example, [2, 3, 2] returns 12.
 *
 * `product` returns 1 (the multiplication identity) if the length of the array-like
 * is 0, or all the elements are sparse.
 *
 * If the product is equal to or greater than Number.MAX_VALUE the return value will
 * be clamped to Number.MAX_VALUE. If the product is equal to or less than -Number.MAX_VALUE
 * the return value will be clamped to -Number.MAX_VALUE. During calculation, `multiply`
 * clamps the running total to between -Number.MAX_VALUE and Number.MAX_VALUE inclusive.
 *
 * If `product` reaches an array element that is NaN or a non-number type it will stop
 * execution and return an `Error`.
 *
 * Empty elements in sparse arrays will be ignored.
 * @param numbers An array-like of numbers.
 * @returns The product of the numbers in the array-like, or an Error.
 */
export const product = (numbers: ArrayLike<number>): number | Error => {
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
    return 1;
  }

  const len = numbers.length;
  const clampTotal = (current: number) =>
    clamp(current, -Number.MAX_VALUE, Number.MAX_VALUE);
  let total = 1;

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

    if (total === undefined) {
      total = numbers[i].valueOf();
      continue;
    }

    total = total * numbers[i].valueOf();

    const clampedTotal = clampTotal(total);

    if (isError(clampedTotal)) {
      const msg = `An unknown error has occurred. Execution stopped. This may be a bug in @moonjellydigital/utils.`;
      const errData: ErrData = {
        code: 'UnknownError',
        prevErr: total as unknown as Error,
        args: [numbers],
      };
      return new Error(msg, { cause: errData });
    }

    total = clampedTotal;
  }

  return total;
};
