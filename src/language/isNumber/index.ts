/**
 * Checks if a value is a number primitive or Number object.
 *
 * NaN, +Infinity, and -Infinity also return true. Use the built-in `Number.isFinite` method if you need to check finiteness.
 * @param value The value to check.
 * @returns True if value is a number primitive or object, false otherwise.
 */
export const isNumber = (value: unknown): value is number | number => {
  if (typeof value === 'number' || value instanceof Number) {
    return true;
  }

  return false;
};
