import { isArrayLike } from '../../language/isArrayLike/index.js';
import { randomInt } from '../../number/randomInt/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Returns a randomly selected element from the array-like if it exists.
 *
 * `sample` returns an `Error` if the array-like is empty or the sampled index is
 * an empty slot in a sparse array. It only returns undefined if the value at the
 * sampled index is undefined`.
 * @param arr The array-like object or string primitive.
 * @returns The value at a randomly chosen index, or an Error.
 */
export const sample = <T>(arr: ArrayLike<T>): T | Error => {
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

  const idx = arr.length === 1 ? 0 : randomInt(0, arr.length - 1);

  if (typeof idx !== 'number') {
    const msg = `Could not generate a random index in arr.`;
    const errData: ErrData = {
      code: 'UnknownError',
      prevErr: idx,
      args: [arr],
    };
    return new Error(msg, { cause: errData });
  }

  if (typeof arr !== 'string' && !(idx in arr)) {
    const msg = `The sampled element in arr was an empty slot.`;
    const errData: ErrData = {
      code: 'EmptySlot',
      prevErr: null,
      args: [arr],
    };
    return new Error(msg, { cause: errData });
  }

  return arr[idx];
};
