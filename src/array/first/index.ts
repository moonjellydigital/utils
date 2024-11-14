import { isArrayLike } from '../../isArrayLike/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Returns the first element of the array-like (0th index) if it exists.
 *
 * `first` returns an `Error` if the array-like is empty or index 0 is an
 * empty slot in a sparse array. It only returns undefined if the value at 0 is
 * undefined, unlike simply doing `arr[0]`.
 * @param arr The array-like object or string primitive.
 * @returns The value at index 0, or an Error.
 */
export const first = <T>(arr: ArrayLike<T>): T | Error => {
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

  if (typeof arr !== 'string' && !(0 in arr)) {
    const msg = `The first element in arr was an empty slot.`;
    const errData: ErrData = {
      code: 'EmptySlot',
      prevErr: null,
      args: [arr],
    };
    return new Error(msg, { cause: errData });
  }

  return arr[0];
};
