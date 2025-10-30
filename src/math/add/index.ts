import { isNumber } from '../../language/isNumber/index.js';
import type { ErrData } from '../../types.ts';

/**
 * Adds two numbers together.
 *
 * If either argument is not of number type or is NaN `add` returns an Error.
 * @param augend The first number to add.
 * @param addend The second number to add.
 * @returns The sum of augend and addend, or an Error.
 */
export const add = (augend: number, addend: number): number | Error => {
  if (!isNumber(augend) || !isNumber(addend)) {
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [augend, addend],
    };
    const msg = `Both augend and addend arguments must be of number type. Args: augend ${augend}, addend ${addend}`;
    return new TypeError(msg, { cause: errData });
  }

  if (Number.isNaN(augend) || Number.isNaN(addend)) {
    const errData: ErrData = {
      code: 'NaN',
      prevErr: null,
      args: [augend, addend],
    };
    const msg = `Both augend and addend arguments must not be NaN. Args: augend ${augend}, addend ${addend}`;
    return new Error(msg, { cause: errData });
  }

  return augend.valueOf() + addend.valueOf();
};
