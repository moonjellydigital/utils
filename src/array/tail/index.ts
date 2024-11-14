import { isArrayLike } from '../../isArrayLike/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Returns a new array containing all the elements from the array-like except
 * the first (0th index), or an empty array if the array-like is empty or only
 * contains one element.
 * @param arr The array-like object or string primitive.
 * @returns A new array containing all elements except the first.
 */
export const tail = <T>(arr: ArrayLike<T>): T[] | Error => {
  if (!isArrayLike(arr)) {
    const msg = `Argument arr must be an array-like`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [arr],
    };
    return new TypeError(msg, { cause: errData });
  }

  return Array.prototype.slice.call(arr, 1);
};
