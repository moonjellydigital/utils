/**
 * Checks whether a value is an array-like object.
 * @param value The value to check.
 * @returns True if the value is array-like, false otherwise.
 */
export const isArrayLike = (value: unknown): boolean => {
  if (
    typeof value === 'object' &&
    value !== null &&
    'length' in value &&
    typeof value.length === 'number' &&
    value.length >= 0 &&
    value.length - 1 in value
  ) {
    return true;
  }
  return false;
};
