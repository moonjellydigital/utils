import { isArrayLike } from '../../language/isArrayLike/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Removes empty slots from a sparse array-like, but leaves elements with falsy values
 * in the array. Does not mutate the original argument; returns a new array. Object
 * elements will be shallow copies.
 * @param arr The array-like to remove empty slots from.
 * @returns A new, dense array with the same elements as the original.
 */
export const unsparse = <T>(arr: ArrayLike<T>): T[] | Error => {
  if (!isArrayLike(arr)) {
    const msg = `Argument arr must be an array-like.`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [arr],
    };
    return new TypeError(msg, { cause: errData });
  }

  return Array.prototype.filter.call(arr, (_, idx) => idx || idx === 0);
};
