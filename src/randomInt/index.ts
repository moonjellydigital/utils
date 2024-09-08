import { type ErrData } from '../err/index.js';

/**
 * Generates a random integer between min and max. The range of possible integers
 * is Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER, inclusive. Arguments
 * that fall outside that range will be clamped if possible.
 *
 * If min is a float, the ceiling of min will be used. If max is a float, the
 * floor of max will be used.
 *
 * Unlike lodash's _.random, randomInt does not swap min and max if max is smaller than min.
 *
 * Do not use for security purposes, use the Crypto built-in instead.
 * @param min A number smaller than max, may be a float
 * @param max A number larger than min, may be a float
 * @returns An integer within the inclusive range of Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER, or an Error
 */
export const randomInt = (min: number, max: number): number | Error => {
  let minCeil = Math.ceil(min);
  let maxFloor = Math.floor(max);

  if (Number.isNaN(minCeil) || Number.isNaN(maxFloor)) {
    const msg = `Both min and max must be numbers. Args: min was ${min}, max was ${max}`;
    const errData: ErrData = {
      code: 'NaN',
      prevErr: null,
      args: [min, max],
    };
    return new TypeError(msg, { cause: errData });
  }

  if (
    minCeil >= Number.MAX_SAFE_INTEGER ||
    maxFloor <= Number.MIN_SAFE_INTEGER
  ) {
    const msg = `Value for min must be less than Number.MAX_SAFE_INTEGER and value for max must be greater than Number.MIN_SAFE_INTEGER. Args: min was ${min}, max was ${max}`;
    const errData: ErrData = {
      code: 'InvalidRange',
      prevErr: null,
      args: [min, max],
    };
    return new RangeError(msg, { cause: errData });
  }

  if (minCeil < Number.MIN_SAFE_INTEGER) {
    minCeil = Number.MIN_SAFE_INTEGER;
  }

  if (maxFloor > Number.MAX_SAFE_INTEGER) {
    maxFloor = Number.MAX_SAFE_INTEGER;
  }

  if (maxFloor === minCeil) {
    const msg = `Values for min and max cannot be equal. Args: min was ${min}, max was ${max}`;
    const errData: ErrData = {
      code: 'InvalidRange',
      prevErr: null,
      args: [min, max],
    };
    return new RangeError(msg, { cause: errData });
  }

  if (minCeil > maxFloor) {
    const msg = `Value of max must be greater than min. Args: min was ${min}, max was ${max}`;
    const errData: ErrData = {
      code: 'InvalidRange',
      prevErr: null,
      args: [min, max],
    };
    return new RangeError(msg, { cause: errData });
  }

  const potentialRet = Math.floor(
    Math.random() * (maxFloor - minCeil + 1) + minCeil,
  );
  // Occasionally the above calculation produces a number greater than Number.MAX_SAFE_INTEGER
  // when min is Number.MAX_SAFE_INTEGER - 1 and max is Number.MAX_SAFE_INTEGER. When that
  // happens, the return value is clamped to Number.MAX_SAFE_INTEGER.
  return potentialRet > Number.MAX_SAFE_INTEGER ?
      Number.MAX_SAFE_INTEGER
    : potentialRet;
};
