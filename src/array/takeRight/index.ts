import { isArrayLike } from '../../isArrayLike/index.js';
import { isNumber } from '../../isNumber/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Returns the specified number of elements from the end (length - 1 index) of an array-like.
 *
 * Does not mutate the original object. Works with sparse array-like objects.
 * @param arr The array-like object or string primitive.
 * @param n The number of elements to return.
 * @returns A new array containing the last n elements from arr.
 */
export const takeRight = <T>(arr: ArrayLike<T>, n: number): T[] | Error => {
  if (!isArrayLike(arr) || !isNumber(n)) {
    const msg = `Argument arr must be an array-like. Argument n must be a number.`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [arr, n],
    };
    return new TypeError(msg, { cause: errData });
  }

  const nValue = n.valueOf();

  if (Number.isNaN(nValue) || !Number.isSafeInteger(nValue) || nValue < 0) {
    const msg = `Argument n must an integer equal to or greater than 0.`;
    const errData: ErrData = {
      code: 'InvalidRange',
      prevErr: null,
      args: [arr, n],
    };
    return new RangeError(msg, { cause: errData });
  }

  return Array.prototype.slice.call(arr, arr.length - nValue);
};
