import { isNumber } from '../../language/isNumber/index.js';
import { clamp } from '../../number/clamp/index.js';
import type { ErrData } from '../../types.d.ts';
import { isError } from '../../language/isError/index.js';

/**
 * Subtract one number from another.
 *
 * Arguments will be clamped to the inclusive range of -Number.MAX_VALUE to Number.MAX_VALUE.
 * If the result is outside the inclusive range of -Number.MAX_VALUE to Number.MAX_VALUE, it
 * will be clamped before returning it.
 * @param minuend The first number in the subtraction.
 * @param subtrahend The second number, which will be subtracted from the minuend.
 * @returns The result of the calculation `minuend - subtrahend`.
 */
export const difference = (
  minuend: number,
  subtrahend: number,
): number | Error => {
  if (!isNumber(minuend) || !isNumber(subtrahend)) {
    const msg = `Arguments minuend and subtrahend must both be numbers. Args: minuend was ${minuend}, subtrahend was ${subtrahend}`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [minuend, subtrahend],
    };
    return new TypeError(msg, { cause: errData });
  }

  if (Number.isNaN(minuend.valueOf()) || Number.isNaN(subtrahend.valueOf())) {
    const msg = `Arguments minuend and subtrahend cannot be NaN. Args: minuend was ${minuend}, subtrahend was ${subtrahend}`;
    const errData: ErrData = {
      code: 'NaN',
      prevErr: null,
      args: [minuend, subtrahend],
    };
    return new RangeError(msg, { cause: errData });
  }

  const clampValue = (val: number) =>
    clamp(val, -Number.MAX_VALUE, Number.MAX_VALUE);

  const clampedA = clampValue(minuend);
  const clampedB = clampValue(subtrahend);

  if (isError(clampedA)) {
    const msg = `An unknown error has occurred. This may be a bug in @moonjellydigital/utils.`;
    const errData: ErrData = {
      code: 'UnknownError',
      prevErr: clampedA,
      args: [minuend, subtrahend],
    };
    return new Error(msg, { cause: errData });
  }

  if (isError(clampedB)) {
    const msg = `An unknown error has occurred. This may be a bug in @moonjellydigital/utils.`;
    const errData: ErrData = {
      code: 'UnknownError',
      prevErr: clampedB,
      args: [minuend, subtrahend],
    };
    return new Error(msg, { cause: errData });
  }

  return clampValue(clampedA - clampedB);
};
