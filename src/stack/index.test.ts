import { Stack } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../types';

describe('Stack', () => {
  test('should be able to add elements to the stack', () => {
    const stack = new Stack();
    expect(stack.length).toBe(0);
    stack.add('item1');
    expect(stack.length).toBe(1);
  });

  test('should be able to remove elements from the stack', () => {
    const stack = new Stack();
    expect(stack.length).toBe(0);
    stack.add('item1');
    stack.add('item2');
    expect(stack.length).toBe(2);
    stack.remove();
    expect(stack.length).toBe(1);
  });

  test('should be able to delete all the elements from the stack', () => {
    const stack = new Stack();
    expect(stack.length).toBe(0);
    stack.add('item1');
    stack.add('item2');
    expect(stack.length).toBe(2);
    stack.clear();
    expect(stack.length).toBe(0);
  });

  test('should be a LIFO queue', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const stack = new Stack();
    stack.add(items[0]);
    stack.add(items[1]);
    stack.add(items[2]);
    stack.add(items[3]);
    expect(stack.remove()).toBe('item4');
    expect(stack.remove()).toBe('item3');
    expect(stack.remove()).toBe('item2');
    expect(stack.remove()).toBe('item1');
  });

  test('peek should return the last element on the stack, but not remove it from the stack', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const stack = new Stack();
    stack.add(items[3]);
    stack.add(items[2]);
    stack.add(items[1]);
    stack.add(items[0]);
    expect(stack.peek()).toBe('item1');
    expect(stack.length).toBe(4);
  });

  test('peek should return undefined if the stack is empty', () => {
    const stack = new Stack();
    expect(stack.length).toBe(0);
    expect(stack.peek()).toBe(undefined);
  });

  test('should hold a reference to object elements, not make a copy', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const stack = new Stack();
    stack.add(item1);
    stack.add(item2);
    expect(stack.remove()).toBe(item2);
    expect(stack.remove()).toBe(item1);
  });

  test('toArrayShallow should return a shallow copy of its elements', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const stack = new Stack();
    stack.add(item1);
    stack.add(item2);
    const arr = stack.toArrayShallow();
    expect(arr[0]).toBe(item1);
    expect(arr[1]).toBe(item2);
  });

  test('toArrayDeep should return a deep copy of its elements', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const stack = new Stack();
    stack.add(item1);
    stack.add(item2);
    const arr = stack.toArrayDeep() as Array<object>;
    expect(arr[0]).toEqual({ age: 42, name: 'Bob' });
    expect(arr[0]).not.toBe(item1);
    expect(arr[1]).toEqual({ age: 56, name: 'Cindy' });
    expect(arr[1]).not.toBe(item2);
  });

  test('toArrayDeep should return an error if copying fails', () => {
    const item1 = Symbol('sym1');
    const item2 = 42;
    const stack = new Stack();
    stack.add(item1);
    stack.add(item2);
    const err = stack.toArrayDeep() as Error;
    const errData = err.cause as ErrData;
    expect(err).toBeInstanceOf(Error);
    expect(errData.code).toBe('DeepCopyFailed');
    expect(errData.prevErr).toBeInstanceOf(Error);
    expect(errData.args).toEqual([]);
  });
});
