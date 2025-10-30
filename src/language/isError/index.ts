/**
 * Checks if value is an Error object. Prefers Error.isError if available, otherwise uses an instanceof check.
 * @param value The value to check.
 * @returns True if value is an Error, false otherwise.
 */
export const isError = (value: unknown): value is Error => {
  if (Error?.isError && Error.isError(value)) {
    return true;
  }

  if (typeof value === 'object' && value instanceof Error) {
    return true;
  }

  return false;
};
