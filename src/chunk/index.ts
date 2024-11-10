import { isNumber } from '../isNumber/index.js';
import type { ErrData } from '../types.d.ts';

/**
 * Splits an array into a multi-dimensional array with sub-arrays of a specified length.
 *
 * If your array cannot be split into sub-arrays that all have the same length, the last
 * sub-array will be short. If your array has length 0, `chunk` will return [].
 *
 * `chunk` does not mutate the original array, it returns a new array. If your array
 * contains object elements `chunk` will make a shallow copy of them.
 * @param arr The array to split.
 * @param size The length the sub-arrays should have.
 * @returns A new multi-dimensional array of chunks.
 */
export const chunk = <T>(arr: T[], size: number): T[][] | Error => {
  if (!Array.isArray(arr) || !isNumber(size)) {
    const msg = `Argument arr must be an array. Argument size must be a number.`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [arr, size],
    };
    return new TypeError(msg, { cause: errData });
  }

  if (
    Number.isNaN(size) ||
    !Number.isSafeInteger(size) ||
    size.valueOf() <= 0
  ) {
    const msg = `Argument size must be an integer greater than 0.`;
    const errData: ErrData = {
      code: 'InvalidRange',
      prevErr: null,
      args: [arr, size],
    };
    return new RangeError(msg, { cause: errData });
  }

  if (arr.length === 0) {
    return [];
  }

  const numberOfChunks = Math.ceil(arr.length / size);
  const result = new Array(numberOfChunks);

  let currStart = 0;
  let currEnd = currStart + size > arr.length - 1 ? null : currStart + size;

  for (let i = 0; i < numberOfChunks; i++) {
    if (currEnd === null) {
      result[i] = arr.slice(currStart);
      break;
    }

    result[i] = arr.slice(currStart, currEnd);

    currStart = currEnd;
    currEnd = currStart + size > arr.length - 1 ? null : currStart + size;
  }

  return result;
};
