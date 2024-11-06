import { Queue } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../types';

describe('Queue', () => {
  test('should be able to add elements to the queue', () => {
    const q = new Queue();
    expect(q.length).toBe(0);
    q.add('item1');
    expect(q.length).toBe(1);
  });

  test('should be able to remove elements from the queue', () => {
    const q = new Queue();
    expect(q.length).toBe(0);
    q.add('item1');
    q.add('item2');
    expect(q.length).toBe(2);
    q.remove();
    expect(q.length).toBe(1);
  });

  test('should be able to delete all the elements from the queue', () => {
    const q = new Queue();
    expect(q.length).toBe(0);
    q.add('item1');
    q.add('item2');
    expect(q.length).toBe(2);
    q.clear();
    expect(q.length).toBe(0);
  });

  test('should be a FIFO queue', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const q = new Queue();
    q.add(items[0]);
    q.add(items[1]);
    q.add(items[2]);
    q.add(items[3]);
    expect(q.remove()).toBe('item1');
    expect(q.remove()).toBe('item2');
    expect(q.remove()).toBe('item3');
    expect(q.remove()).toBe('item4');
  });

  test('peek should return the head of the queue, but not remove it from the queue', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const q = new Queue();
    q.add(items[3]);
    q.add(items[2]);
    q.add(items[1]);
    q.add(items[0]);
    expect(q.peek()).toBe('item4');
    expect(q.length).toBe(4);
  });

  test('peek should return undefined if the queue is empty', () => {
    const q = new Queue();
    expect(q.length).toBe(0);
    expect(q.peek()).toBe(undefined);
  });

  test('should hold a reference to object elements, not make a copy', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const q = new Queue();
    q.add(item1);
    q.add(item2);
    expect(q.remove()).toBe(item1);
    expect(q.remove()).toBe(item2);
  });

  test('toArrayShallow should return a shallow copy of its elements', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const q = new Queue();
    q.add(item1);
    q.add(item2);
    const arr = q.toArrayShallow();
    expect(arr[0]).toBe(item1);
    expect(arr[1]).toBe(item2);
  });

  test('toArrayDeep should return a deep copy of its elements', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const q = new Queue();
    q.add(item1);
    q.add(item2);
    const arr = q.toArrayDeep() as Array<object>;
    expect(arr[0]).toEqual({ age: 42, name: 'Bob' });
    expect(arr[0]).not.toBe(item1);
    expect(arr[1]).toEqual({ age: 56, name: 'Cindy' });
    expect(arr[1]).not.toBe(item2);
  });

  test('toArrayDeep should return an error if copying fails', () => {
    const item1 = Symbol('sym1');
    const item2 = 42;
    const q = new Queue();
    q.add(item1);
    q.add(item2);
    const err = q.toArrayDeep() as Error;
    const errData = err.cause as ErrData;
    expect(err).toBeInstanceOf(Error);
    expect(errData.code).toBe('DeepCopyFailed');
    expect(errData.prevErr).toBeInstanceOf(Error);
    expect(errData.args).toEqual([]);
  });

  test('toString returns a string representation of the queue elements in the correct order', () => {
    const q = new Queue();
    q.add('item1');
    q.add('item2');
    q.add('item3');
    expect(q.toString()).toContain('item1,item2,item3');
  });
});
