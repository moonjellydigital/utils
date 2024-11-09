import type { ErrData } from '../types.d.ts';

export class Stack<T> {
  #elements: T[];
  #mjdUtilsStack = undefined;

  /**
   * Stack is a simple LIFO queue.
   *
   * Stack isn't size constrained other than by the runtime (you can't set a
   * limit on the number of elements). The maximum number of elements a Stack
   * can hold is less than 2**32.
   */
  constructor() {
    this.#elements = [];
  }

  /**
   * Add an element to the stack. Mutates the stack.
   * @param element The element to put on the stack.
   */
  add(element: T): void {
    this.#elements.push(element);
  }

  /**
   * Remove an element from the stack. Mutates the stack.
   *
   * To differentiate between a return value of undefined because the stack is
   * empty and an element with the value undefined, check the length property
   * of the stack.
   * @returns The last element in the stack, or undefined if the stack is empty.
   */
  remove(): T | undefined {
    return this.#elements.pop();
  }

  /**
   * Returns the last element added to the stack. Does not mutate the stack.
   *
   * To differentiate between a return value of undefined because the stack is
   * empty and an element with the value undefined, check the length property
   * of the stack.
   * @returns A reference to the element at the last element in the stack if element is
   * an object, the value of the element if it is a primitive, or undefined if
   * the stack is empty.
   */
  peek(): T | undefined {
    if (this.#elements.length === 0) {
      return undefined;
    }
    return this.#elements[this.#elements.length - 1];
  }

  /**
   * Clear all elements from the stack.
   */
  clear(): void {
    this.#elements = [];
  }

  /**
   * Makes a shallow copy of the stack's elements.
   * @returns An array populated with shallow copies of the stack elements.
   */
  toArrayShallow(): T[] {
    return this.#elements.slice();
  }

  /**
   * Makes a deep copy of the stack's elements.
   * @returns An array populated with deep copies of the stack elements, or an Error if copying fails.
   */
  toArrayDeep(): T[] | Error {
    try {
      return structuredClone(this.#elements);
    } catch (err) {
      const msg = `Deep copying stack elements failed.`;
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
   * @returns A string representation of the stack's elements.
   */
  toString() {
    return this.#elements.toString();
  }

  /**
   * Read-only length property.
   * @returns The number of elements in the stack.
   */
  get length(): number {
    return this.#elements.length;
  }

  get [Symbol.toStringTag]() {
    return 'Stack';
  }

  /**
   * Performs a brand check.
   * @param obj The object to check.
   * @returns True if the object was created with the Stack constructor, false otherwise.
   */
  static isStack(obj: unknown): boolean {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    return #mjdUtilsStack in obj;
  }
}
