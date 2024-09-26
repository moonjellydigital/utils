/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * No-op. Accepts any number of any types of arguments, then does nothing with them.
 * @param args Any number of any types of arguments.
 */
// @ts-expect-error noUnusedParameters
export const noop = (...args: unknown[]): undefined => {};
