import type { ErrData } from '../../types.d.ts';
import { isNumber } from '../../language/isNumber/index.js';

/**
 * Clamps a number, n, within the inclusive range of lower and upper bound.
 *
 * Both lower and upper bound must be provided. If n is lower than the lower
 * bound, `clamp` returns the value of lower. If n is greater than the upper
 * bound, `clamp` returns the value of upper. Otherwise, it returns the value
 * of n.
 * @param n The number to clamp.
 * @param lower The lower bound of the clamp range.
 * @param upper The upper bound of the clamp range.
 * @returns The clamped number value.
 */
export const clamp = (n: number, lower: number, upper: number) => {
  if (!isNumber(n) || !isNumber(lower) || !isNumber(upper)) {
    const msg = `Arguments n, lower, and upper must be numbers. Args: n was ${n}, lower was ${lower}, upper was ${upper}`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [n, lower, upper],
    };
    return new TypeError(msg, { cause: errData });
  }

  const nValue = n.valueOf();
  const lowerValue = lower.valueOf();
  const upperValue = upper.valueOf();

  if (
    Number.isNaN(nValue) ||
    Number.isNaN(lowerValue) ||
    Number.isNaN(upperValue)
  ) {
    const msg = `Arguments n, lower, and upper must no be NaN. Args: n was ${n}, lower was ${lower}, upper was ${upper}`;
    const errData: ErrData = {
      code: 'NaN',
      prevErr: null,
      args: [n, lower, upper],
    };
    return new Error(msg, { cause: errData });
  }

  if (lowerValue > upperValue) {
    const msg = `Argument upper must be greater than or equal to lower. Args: n was ${n}, lower was ${lower}, upper was ${upper}`;
    const errData: ErrData = {
      code: 'InvalidRange',
      prevErr: null,
      args: [n, lower, upper],
    };
    return new RangeError(msg, { cause: errData });
  }

  return Math.min(Math.max(nValue, lowerValue), upperValue);
};
