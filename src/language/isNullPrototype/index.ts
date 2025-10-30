/**
 * Checks if a value is an object with a null prototype.
 * @param value The value to check.
 * @returns True if the value is an object with a null prototype, false otherwise.
 */
export const isNullPrototype = (value: unknown): value is object => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (Reflect.getPrototypeOf(value) !== null) {
    return false;
  }

  return true;
};
