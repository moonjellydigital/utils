/**
 * Checks whether a value is an array-like object.
 * @param value The value to check.
 * @returns True if the value is array-like, false otherwise.
 */
export const isArrayLike = (value: unknown): value is ArrayLike<unknown> => {
  if (
    typeof value === 'string' ||
    (typeof value === 'object' &&
      value !== null &&
      'length' in value &&
      typeof value.length === 'number' &&
      value.length >= 0 &&
      value.length <= Number.MAX_SAFE_INTEGER)
  ) {
    return true;
  }

  return false;
};
