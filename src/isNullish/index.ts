/**
 * Checks if the argument is null or undefined.
 * @param val The value to evaluate.
 * @returns True if val is null or undefined, false otherwise.
 */
export const isNullish = (val: unknown): boolean => {
  if (val === undefined || val === null) {
    return true;
  }
  return false;
};
