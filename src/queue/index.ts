import type { ErrData } from '../types.d.ts';

export class Queue<T> {
  #elements: T[];
  #mjdUtilsQueue = undefined;

  /**
   * Queue is a simple FIFO queue.
   *
   * Queue isn't size constrained other than by the runtime (you can't set a
   * limit on the number of elements). The maximum number of elements a Queue
   * can hold is less than 2**32.
   */
  constructor() {
    this.#elements = [];
  }

  /**
   * Add an element to the queue. Mutates the queue.
   * @param element The element to append to the queue.
   */
  add(element: T): void {
    this.#elements.push(element);
  }

  /**
   * Remove an element from the queue. Mutates the queue.
   *
   * To differentiate between a return value of undefined because the queue is
   * empty and an element with the value undefined, check the length property
   * of the queue.
   * @returns The element at the head of the queue, or undefined if the queue is empty.
   */
  remove(): T | undefined {
    return this.#elements.shift();
  }

  /**
   * Returns the head of the queue. Does not mutate the queue.
   *
   * To differentiate between a return value of undefined because the queue is
   * empty and an element with the value undefined, check the length property
   * of the queue.
   * @returns A reference to the element at the head of the queue if element is
   * an object, the value of the element if it is a primitive, or undefined if
   * the queue is empty.
   */
  peek(): T | undefined {
    if (this.#elements.length === 0) {
      return undefined;
    }
    return this.#elements[0];
  }

  /**
   * Clear all elements from the queue.
   */
  clear(): void {
    this.#elements = [];
  }

  /**
   * Makes a shallow copy of the queue's elements.
   * @returns An array populated with shallow copies of the queue elements.
   */
  toArrayShallow(): T[] {
    return this.#elements.slice();
  }

  /**
   * Makes a deep copy of the queue's elements.
   * @returns An array populated with deep copies of the queue elements, or an Error if copying fails.
   */
  toArrayDeep(): T[] | Error {
    try {
      return structuredClone(this.#elements);
    } catch (err) {
      const msg = `Deep copying queue elements failed.`;
      const errData: ErrData = {
        code: 'DeepCopyFailed',
        prevErr:
          err instanceof Error ? err : (
            new Error('structuredClone error', { cause: err })
          ),
        args: [],
      };
      return new Error(msg, { cause: errData });
    }
  }

  /**
   * @returns A string representation of the queue's elements.
   */
  toString() {
    return this.#elements.toString();
  }

  /**
   * Read-only length property.
   * @returns The number of elements in the queue.
   */
  get length(): number {
    return this.#elements.length;
  }

  get [Symbol.toStringTag]() {
    return 'Queue';
  }

  /**
   * Performs a brand check.
   * @param obj The object to check.
   * @returns True if the object was made with the Queue constructor, false otherwise.
   */
  static isQueue(obj: unknown): boolean {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    return #mjdUtilsQueue in obj;
  }
}
