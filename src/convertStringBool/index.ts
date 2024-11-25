import { isString } from '../language/isString/index.js';
import type { ErrData } from '../types.d.ts';

/**
 * Converts string 'false' and 'true' to the corresponding boolean value.
 * `convertStringBool` will trim both ends of your string and normalize it to
 * lower case.
 * @param value The string to convert.
 * @returns Boolean true or false, or an Error if value was not one of 'true' or 'false' strings.
 */
export const convertStringBool = (value: string): boolean | Error => {
  if (!isString(value)) {
    const msg = `Argument value must be a string.`;
    const errData: ErrData = {
      code: 'WrongType',
      prevErr: null,
      args: [value],
    };
    return new TypeError(msg, { cause: errData });
  }

  if (value.valueOf().trim().toLowerCase() === 'false') {
    return false;
  }

  if (value.valueOf().trim().toLowerCase() === 'true') {
    return true;
  }

  const msg = `Argument value was not string 'true' or string 'false'.`;
  const errData: ErrData = {
    code: 'InvalidRange',
    prevErr: null,
    args: [value],
  };
  return new RangeError(msg, { cause: errData });
};
