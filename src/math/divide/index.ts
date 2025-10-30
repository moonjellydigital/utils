import { isNumber } from '../../language/isNumber/index.js';
import { clamp } from '../../number/clamp/index.js';
import type { ErrData } from '../../types.d.ts';
import { isError } from '../../language/isError/index.js';

/**
 * Divide one number by another.
 *
 * Arguments will be clamped to the inclusive range of -Number.MAX_VALUE to Number.MAX_VALUE.
 * If the result is outside the inclusive range of -Number.MAX_VALUE to Number.MAX_VALUE, it
 * will be clamped before returning it.
 * @param dividend The number to be divided.
 * @param divisor The number to divide by.
 * @returns The result of the calculation `dividend / divisor`.
 */
export const divide = (dividend: number, divisor: number): number | Error => {
  if (!isNumber(dividend) || !isNumber(divisor)) {
    const msg = `Arguments dividend and divisor must both be numbers. Args: dividend was ${dividend}, divisor was ${divisor}`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [dividend, divisor],
    };
    return new TypeError(msg, { cause: errData });
  }

  if (Number.isNaN(dividend.valueOf()) || Number.isNaN(divisor.valueOf())) {
    const msg = `Arguments dividend and divisor cannot be NaN. Args: dividend was ${dividend}, divisor was ${divisor}`;
    const errData: ErrData = {
      code: 'NaN',
      prevErr: null,
      args: [dividend, divisor],
    };
    return new RangeError(msg, { cause: errData });
  }

  if (divisor.valueOf() === 0) {
    const msg = `Cannot divide by 0. Args: dividend was ${dividend}, divisor was ${divisor}`;
    const errData: ErrData = {
      code: 'ZeroDivisionError',
      prevErr: null,
      args: [dividend, divisor],
    };
    return new RangeError(msg, { cause: errData });
  }

  const clampValue = (val: number) =>
    clamp(val, -Number.MAX_VALUE, Number.MAX_VALUE);

  const clampedA = clampValue(dividend);
  const clampedB = clampValue(divisor);

  if (isError(clampedA)) {
    const msg = `An unknown error has occurred. This may be a bug in @moonjellydigital/utils.`;
    const errData: ErrData = {
      code: 'UnknownError',
      prevErr: clampedA,
      args: [dividend, divisor],
    };
    return new Error(msg, { cause: errData });
  }

  if (isError(clampedB)) {
    const msg = `An unknown error has occurred. This may be a bug in @moonjellydigital/utils.`;
    const errData: ErrData = {
      code: 'UnknownError',
      prevErr: clampedB,
      args: [dividend, divisor],
    };
    return new Error(msg, { cause: errData });
  }

  return clampValue(clampedA / clampedB);
};
