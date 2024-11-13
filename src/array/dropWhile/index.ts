import { isArrayLike } from '../../isArrayLike/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Removes elements from the start of the array (0th index) while the predicate
 * returns true. Returns the un-dropped elements in a new array.
 *
 * Does not mutate the original object. Works with sparse array-like objects.
 * @param arr The array-like object or string primitive.
 * @param predicate The function to test elements with.
 * @returns A new array containing all elements except the first n.
 */
export const dropWhile = <T>(
  arr: ArrayLike<T>,
  predicate: (element: T, index?: number, arr?: ArrayLike<T>) => boolean,
): T[] | Error => {
  if (!isArrayLike(arr) || typeof predicate !== 'function') {
    const msg = `Argument arr must be an array-like. Argument predicate must be a function.`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [arr, predicate],
    };
    return new TypeError(msg, { cause: errData });
  }

  const idx = Array.prototype.findIndex.call(
    arr,
    (element, index, arr) => !predicate(element, index, arr),
  );

  if (idx === -1) {
    return [];
  }

  return Array.prototype.slice.call(arr, idx);
};
