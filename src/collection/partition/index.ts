import { isArrayLike } from '../../language/isArrayLike/index.js';
import type { ErrData } from '../../types.d.ts';

/**
 * Split the original array-like into an array of two arrays, where first array
 * contains elements that the predicate returned truthy for and the second contains
 * elements that the predicate returned falsy for.
 *
 * Empty slots in sparse arrays are ignored.
 * @param arr The array-like to partition.
 * @param predicate The function to evaluate elements with. Can accept arguments
 * for element value, element index, and the object the function was called on.
 * @returns A new array of two arrays with the first containing elements the predicate
 * returned truthy for, and the second containing elements the predicate returned falsy for.
 */
export const partition = <T>(
  arr: ArrayLike<T>,
  predicate: (value: T, index?: number, arrArg?: ArrayLike<T>) => boolean,
): [truthy: T[], falsy: T[]] | Error => {
  if (!isArrayLike(arr) || typeof predicate !== 'function') {
    const msg = `Argument arr must be an array-like and argument predicate must be a function.`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [arr, predicate],
    };
    return new TypeError(msg, { cause: errData });
  }

  const truthy: T[] = [];
  const falsy: T[] = [];

  Array.prototype.forEach.call(arr, (el, index, arrArg) => {
    if (predicate(el, index, arrArg)) {
      truthy.push(el);
    } else if (!predicate(el, index, arrArg)) {
      falsy.push(el);
    }
  });

  return [truthy, falsy];
};
