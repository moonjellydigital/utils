import { isNumber } from '../../language/isNumber/index.js';
import type { ErrData } from '../../types.ts';

/**
 * Multiplies two numbers together.
 *
 * If either argument is not of number type or is NaN `add` returns an Error.
 * @param multiplier The first number to add.
 * @param multiplicand The second number to add.
 * @returns The sum of multiplier and multiplicand, or an Error.
 */
export const multiply = (
  multiplier: number,
  multiplicand: number,
): number | Error => {
  if (!isNumber(multiplier) || !isNumber(multiplicand)) {
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [multiplier, multiplicand],
    };
    const msg = `Both multiplier and multiplicand arguments must be of number type. Args: multiplier ${multiplier}, multiplicand ${multiplicand}`;
    return new TypeError(msg, { cause: errData });
  }

  if (Number.isNaN(multiplier) || Number.isNaN(multiplicand)) {
    const errData: ErrData = {
      code: 'NaN',
      prevErr: null,
      args: [multiplier, multiplicand],
    };
    const msg = `Both multiplier and multiplicand arguments must not be NaN. Args: multiplier ${multiplier}, multiplicand ${multiplicand}`;
    return new Error(msg, { cause: errData });
  }

  return multiplier.valueOf() * multiplicand.valueOf();
};
