import { isArrayLike } from '../../language/isArrayLike/index.js';
import { isNumber } from '../../language/isNumber/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Returns the element at the supplied index of the array-like if it exists.
 *
 * `nth` returns an `Error` if the array-like is empty or the nth index is an
 * empty slot in a sparse array. It only returns undefined if the value at
 * the index is undefined, unlike simply doing `arr[index]`.
 * @param arr The array-like object or string primitive.
 * @param index The index to access.
 * @returns The value at index, or an Error.
 */
export const nth = <T>(arr: ArrayLike<T>, index: number): T | Error => {
  if (!isArrayLike(arr) || !isNumber(index)) {
    const msg = `Argument arr must be an array-like and argument index must be a number.`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [arr, index],
    };
    return new TypeError(msg, { cause: errData });
  }

  if (arr.length === 0) {
    const msg = `Argument arr contains no elements.`;
    const errData: ErrData = {
      code: 'EmptyCollection',
      prevErr: null,
      args: [arr, index],
    };
    return new Error(msg, { cause: errData });
  }

  if (typeof arr !== 'string' && !(index.valueOf() in arr)) {
    const msg = `The element at index ${index.valueOf()} in arr was an empty slot.`;
    const errData: ErrData = {
      code: 'EmptySlot',
      prevErr: null,
      args: [arr, index],
    };
    return new Error(msg, { cause: errData });
  }

  return arr[index.valueOf()];
};
