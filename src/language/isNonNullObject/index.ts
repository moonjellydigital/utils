/**
 * Checks if a value has a typeof 'object' and is not null.
 * @param value The value to check.
 * @returns True if value has typeof 'object' and is not null, false otherwise.
 */
export const isNonNullObject = (value: unknown): value is object => {
  if (typeof value === 'object' && value !== null) {
    return true;
  }
  return false;
};
