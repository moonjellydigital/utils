/**
 * Checks if a value is a string primitive or String object.
 * @param value The value to check.
 * @returns True if value is a string primitive or object, false otherwise.
 */
export const isString = (value: unknown): value is string | string => {
  if (typeof value === 'string' || value instanceof String) {
    return true;
  }
  return false;
};
