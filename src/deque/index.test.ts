import { Deque } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../types';

describe('Deque', () => {
  test('should be able to add elements to the front of the deque', () => {
    const dek = new Deque();
    expect(dek.length).toBe(0);
    dek.addFirst('item1');
    expect(dek.length).toBe(1);
  });

  test('should be able to remove elements from the front of the deque', () => {
    const dek = new Deque();
    expect(dek.length).toBe(0);
    dek.addFirst('item1');
    dek.addFirst('item2');
    expect(dek.length).toBe(2);
    const removed = dek.removeFirst();
    expect(removed).toBe('item2');
    expect(dek.length).toBe(1);
  });

  test('should be able to add elements to the end of the deque', () => {
    const dek = new Deque();
    expect(dek.length).toBe(0);
    dek.addLast('item1');
    expect(dek.length).toBe(1);
  });

  test('should be able to remove elements from the end of the deque', () => {
    const dek = new Deque();
    expect(dek.length).toBe(0);
    dek.addLast('item1');
    dek.addLast('item2');
    expect(dek.length).toBe(2);
    const removed = dek.removeLast();
    expect(removed).toBe('item2');
    expect(dek.length).toBe(1);
  });

  test('should be able to delete all the elements from the deque', () => {
    const dek = new Deque();
    expect(dek.length).toBe(0);
    dek.addFirst('item1');
    dek.addFirst('item2');
    expect(dek.length).toBe(2);
    dek.clear();
    expect(dek.length).toBe(0);
  });

  test('should work as a FIFO queue', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const dek = new Deque();
    dek.addLast(items[0]);
    dek.addLast(items[1]);
    dek.addLast(items[2]);
    dek.addLast(items[3]);
    expect(dek.removeFirst()).toBe('item1');
    expect(dek.removeFirst()).toBe('item2');
    expect(dek.removeFirst()).toBe('item3');
    expect(dek.removeFirst()).toBe('item4');
  });

  test('should work as a LIFO queue', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const dek = new Deque();
    dek.addLast(items[0]);
    dek.addLast(items[1]);
    dek.addLast(items[2]);
    dek.addLast(items[3]);
    expect(dek.removeLast()).toBe('item4');
    expect(dek.removeLast()).toBe('item3');
    expect(dek.removeLast()).toBe('item2');
    expect(dek.removeLast()).toBe('item1');
  });

  test('peekFirst should return the head of the deque, but not remove it from the deque', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const dek = new Deque();
    dek.addLast(items[3]);
    dek.addLast(items[2]);
    dek.addLast(items[1]);
    dek.addLast(items[0]);
    expect(dek.peekFirst()).toBe('item4');
    expect(dek.length).toBe(4);
  });

  test('peekFirst should return undefined if the deque is empty', () => {
    const dek = new Deque();
    expect(dek.length).toBe(0);
    expect(dek.peekFirst()).toBe(undefined);
  });

  test('peekLast should return the last element in the tail of the deque, but not remove it from the deque', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const dek = new Deque();
    dek.addLast(items[3]);
    dek.addLast(items[2]);
    dek.addLast(items[1]);
    dek.addLast(items[0]);
    expect(dek.peekLast()).toBe('item1');
    expect(dek.length).toBe(4);
  });

  test('peekLast should return undefined if the deque is empty', () => {
    const dek = new Deque();
    expect(dek.length).toBe(0);
    expect(dek.peekLast()).toBe(undefined);
  });

  test('should hold a reference to object elements, not make a copy', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const dek = new Deque();
    dek.addLast(item1);
    dek.addLast(item2);
    expect(dek.removeFirst()).toBe(item1);
    expect(dek.removeFirst()).toBe(item2);
  });

  test('toArrayShallow should return a shallow copy of its elements', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const dek = new Deque();
    dek.addLast(item1);
    dek.addLast(item2);
    const arr = dek.toArrayShallow();
    expect(arr[0]).toBe(item1);
    expect(arr[1]).toBe(item2);
  });

  test('toArrayDeep should return a deep copy of its elements', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const dek = new Deque();
    dek.addFirst(item1);
    dek.addFirst(item2);
    const arr = dek.toArrayDeep() as Array<object>;
    expect(arr[1]).toEqual({ age: 42, name: 'Bob' });
    expect(arr[1]).not.toBe(item1);
    expect(arr[0]).toEqual({ age: 56, name: 'Cindy' });
    expect(arr[0]).not.toBe(item2);
  });

  test('toArrayDeep should return an error if copying fails', () => {
    const item1 = Symbol('sym1');
    const item2 = 42;
    const dek = new Deque();
    dek.addLast(item1);
    dek.addLast(item2);
    const err = dek.toArrayDeep() as Error;
    const errData = err.cause as ErrData;
    expect(err).toBeInstanceOf(Error);
    expect(errData.code).toBe('DeepCopyFailed');
    expect(errData.prevErr).toBeInstanceOf(Error);
    expect(errData.args).toEqual([]);
  });

  test('toString returns a string representation of the deque elements in the correct order', () => {
    const dek = new Deque();
    dek.addLast('item1');
    dek.addLast('item2');
    dek.addFirst('item3');
    dek.addFirst('item4');
    expect(dek.toString()).toContain('item4,item3,item1,item2');
  });

  test('toStringTag returns class name', () => {
    const dek = new Deque();
    expect(Object.prototype.toString.call(dek)).toContain('Deque');
  });

  test('brand check returns true for instances of Deque', () => {
    const dek = new Deque();
    expect(Deque.isDeque(dek)).toBe(true);
  });

  test.each([
    ['', false],
    [0, false],
    [true, false],
    [false, false],
    [0n, false],
    [undefined, false],
    [null, false],
    [Symbol('Queue'), false],
    [[], false],
    [{}, false],
  ])('brand check isDeque(%s) returns %s', (arg, expected) => {
    expect(Deque.isDeque(arg)).toBe(expected);
  });
});
