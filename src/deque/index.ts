import type { ErrData } from '../types.d.ts';
import { isError } from '../language/isError/index.js';

export class Deque<T> {
  #elements: T[];
  #mjdUtilsDeque = undefined;

  /**
   * Deque is a simple double-ended queue.
   *
   * Deque isn't size constrained other than by the runtime (you can't set a
   * limit on the number of elements). The maximum number of elements a Deque
   * can hold is less than 2**32.
   */
  constructor() {
    this.#elements = [];
  }

  /**
   * Add an element to the tail of the deque. Mutates the deque.
   * @param element The element to append to the deque.
   */
  addLast(element: T): void {
    this.#elements.push(element);
  }

  /**
   * Add an element at the head of the deque. Mutates the deque.
   * @param element The element to add at the head.
   */
  addFirst(element: T): void {
    this.#elements.unshift(element);
  }

  /**
   * Remove an element from the tail of the deque. Mutates the deque.
   *
   * To differentiate between a return value of undefined because the deque is
   * empty and an element with the value undefined, check the length property
   * of the deque.
   * @returns The last element from the tail of the deque, or undefined if the deque is empty.
   */
  removeLast(): T | undefined {
    return this.#elements.pop();
  }

  /**
   * Remove an element from the head of the deque. Mutates the deque.
   *
   * To differentiate between a return value of undefined because the deque is
   * empty and an element with the value undefined, check the length property
   * of the deque.
   * @returns The element at the head of the deque, or undefined if the deque is empty.
   */
  removeFirst(): T | undefined {
    return this.#elements.shift();
  }

  /**
   * Returns the head of the deque. Does not mutate the deque.
   *
   * To differentiate between a return value of undefined because the deque is
   * empty and an element with the value undefined, check the length property
   * of the deque.
   * @returns A reference to the element at the head of the deque if element is
   * an object, the value of the element if it is a primitive, or undefined if
   * the deque is empty.
   */
  peekFirst(): T | undefined {
    if (this.#elements.length === 0) {
      return undefined;
    }
    return this.#elements[0];
  }

  /**
   * Returns the last element from the tail of the deque. Does not mutate the deque.
   *
   * To differentiate between a return value of undefined because the deque is
   * empty and an element with the value undefined, check the length property
   * of the deque.
   * @returns A reference to the last element of the deque if element is
   * an object, the value of the element if it is a primitive, or undefined if
   * the deque is empty.
   */
  peekLast(): T | undefined {
    if (this.#elements.length === 0) {
      return undefined;
    }
    return this.#elements[this.#elements.length - 1];
  }

  /**
   * Clear all elements from the deque.
   */
  clear(): void {
    this.#elements = [];
  }

  /**
   * Makes a shallow copy of the deque's elements.
   * @returns An array populated with shallow copies of the deque elements.
   */
  toArrayShallow(): T[] {
    return this.#elements.slice();
  }

  /**
   * Makes a deep copy of the deque's elements.
   * @returns An array populated with deep copies of the deque elements, or an Error if copying fails.
   */
  toArrayDeep(): T[] | Error {
    try {
      return structuredClone(this.#elements);
    } catch (err) {
      const msg = `Deep copying deque elements failed.`;
      const errData: ErrData = {
        code: 'DeepCopyFailed',
        prevErr:
          isError(err) ? err : (
            new Error('structuredClone error', { cause: err })
          ),
        args: [],
      };
      return new Error(msg, { cause: errData });
    }
  }

  /**
   * @returns A string representation of the deque's elements.
   */
  toString() {
    return this.#elements.toString();
  }

  /**
   * Read-only length property.
   * @returns The number of elements in the deque.
   */
  get length(): number {
    return this.#elements.length;
  }

  get [Symbol.toStringTag]() {
    return 'Deque';
  }

  /**
   * Performs a brand check.
   * @param obj The object to check.
   * @returns True if the object was created with the Deque constructor, false otherwise.
   */
  static isDeque(obj: unknown): boolean {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    return #mjdUtilsDeque in obj;
  }
}
