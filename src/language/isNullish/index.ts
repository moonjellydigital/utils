/**
 * Checks if the argument is null or undefined.
 * @param value The value to evaluate.
 * @returns True if value is null or undefined, false otherwise.
 */
export const isNullish = (value: unknown): value is null | undefined => {
  if (value === undefined || value === null) {
    return true;
  }

  return false;
};
