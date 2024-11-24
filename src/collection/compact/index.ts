import { isArrayLike } from '../../language/isArrayLike/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Remove falsy values from an array-like object. Empty slots in sparse arrays
 * are treated as if they had the value undefined, and are removed. Objects are
 * shallow copied.
 * @param arr The array-like to remove falsy values from.
 * @returns A new array with the truthy values from the original array-like.
 */
export const compact = <T>(arr: ArrayLike<T>): T[] | Error => {
  if (!isArrayLike(arr)) {
    const msg = `Argument arr must be an array-like`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [arr],
    };
    return new TypeError(msg, { cause: errData });
  }

  return Array.prototype.filter.call(arr, (el) => el);
};
