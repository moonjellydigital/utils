import { isArrayLike } from '../../language/isArrayLike/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Returns the last element of the array-like (arr.length - 1 index) if it exists.
 *
 * `last` returns an `Error` if the array-like is empty or the last index is an
 * empty slot in a sparse array. It only returns undefined if the value at at
 * the index is undefined, unlike simply doing `arr[arr.length - 1]`.
 * @param arr The array-like object or string primitive.
 * @returns The value at index 0, or an Error.
 */
export const last = <T>(arr: ArrayLike<T>): T | Error => {
  if (!isArrayLike(arr)) {
    const msg = `Argument arr must be an array-like`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [arr],
    };
    return new TypeError(msg, { cause: errData });
  }

  if (arr.length === 0) {
    const msg = `Argument arr contains no elements.`;
    const errData: ErrData = {
      code: 'EmptyCollection',
      prevErr: null,
      args: [arr],
    };
    return new Error(msg, { cause: errData });
  }

  if (typeof arr !== 'string' && !(arr.length - 1 in arr)) {
    const msg = `The last element in arr was an empty slot.`;
    const errData: ErrData = {
      code: 'EmptySlot',
      prevErr: null,
      args: [arr],
    };
    return new Error(msg, { cause: errData });
  }

  return arr[arr.length - 1];
};
