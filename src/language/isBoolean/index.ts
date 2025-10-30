/**
 * Checks if a value is a boolean primitive or Boolean object.
 * @param value The value to check.
 * @returns True if value is a boolean primitive or object, false otherwise.
 */
export const isBoolean = (value: unknown): value is boolean | boolean => {
  if (typeof value === 'boolean' || value instanceof Boolean) {
    return true;
  }
  return false;
};
