/**
 * Checks if a value is a bigint primitive or BigInt object.
 * @param value The value to check.
 * @returns True if value is a bigint primitive or object, false otherwise.
 */
export const isBigInt = (value: unknown): value is bigint | bigint => {
  if (typeof value === 'bigint' || value instanceof BigInt) {
    return true;
  }

  return false;
};
