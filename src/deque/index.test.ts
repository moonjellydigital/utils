import { Deque } from '.';
import { describe, test, expect } from 'vitest';
import type { ErrData } from '../types';

describe('Deque', () => {
  test('should be able to add elements to the front of the deque', () => {
    const deck = new Deque();
    expect(deck.length).toBe(0);
    deck.addFirst('item1');
    expect(deck.length).toBe(1);
  });

  test('should be able to remove elements from the front of the deque', () => {
    const deck = new Deque();
    expect(deck.length).toBe(0);
    deck.addFirst('item1');
    deck.addFirst('item2');
    expect(deck.length).toBe(2);
    const removed = deck.removeFirst();
    expect(removed).toBe('item2');
    expect(deck.length).toBe(1);
  });

  test('should be able to add elements to the end of the deque', () => {
    const deck = new Deque();
    expect(deck.length).toBe(0);
    deck.addLast('item1');
    expect(deck.length).toBe(1);
  });

  test('should be able to remove elements from the end of the deque', () => {
    const deck = new Deque();
    expect(deck.length).toBe(0);
    deck.addLast('item1');
    deck.addLast('item2');
    expect(deck.length).toBe(2);
    const removed = deck.removeLast();
    expect(removed).toBe('item2');
    expect(deck.length).toBe(1);
  });

  test('should be able to delete all the elements from the deque', () => {
    const deck = new Deque();
    expect(deck.length).toBe(0);
    deck.addFirst('item1');
    deck.addFirst('item2');
    expect(deck.length).toBe(2);
    deck.clear();
    expect(deck.length).toBe(0);
  });

  test('should work as a FIFO queue', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const deck = new Deque();
    deck.addLast(items[0]);
    deck.addLast(items[1]);
    deck.addLast(items[2]);
    deck.addLast(items[3]);
    expect(deck.removeFirst()).toBe('item1');
    expect(deck.removeFirst()).toBe('item2');
    expect(deck.removeFirst()).toBe('item3');
    expect(deck.removeFirst()).toBe('item4');
  });

  test('should work as a LIFO queue', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const deck = new Deque();
    deck.addLast(items[0]);
    deck.addLast(items[1]);
    deck.addLast(items[2]);
    deck.addLast(items[3]);
    expect(deck.removeLast()).toBe('item4');
    expect(deck.removeLast()).toBe('item3');
    expect(deck.removeLast()).toBe('item2');
    expect(deck.removeLast()).toBe('item1');
  });

  test('peekFirst should return the head of the deque, but not remove it from the deque', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const deck = new Deque();
    deck.addLast(items[3]);
    deck.addLast(items[2]);
    deck.addLast(items[1]);
    deck.addLast(items[0]);
    expect(deck.peekFirst()).toBe('item4');
    expect(deck.length).toBe(4);
  });

  test('peekFirst should return undefined if the deque is empty', () => {
    const deck = new Deque();
    expect(deck.length).toBe(0);
    expect(deck.peekFirst()).toBe(undefined);
  });

  test('peekLast should return the last element in the tail of the deque, but not remove it from the deque', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const deck = new Deque();
    deck.addLast(items[3]);
    deck.addLast(items[2]);
    deck.addLast(items[1]);
    deck.addLast(items[0]);
    expect(deck.peekLast()).toBe('item1');
    expect(deck.length).toBe(4);
  });

  test('peekLast should return undefined if the deque is empty', () => {
    const deck = new Deque();
    expect(deck.length).toBe(0);
    expect(deck.peekLast()).toBe(undefined);
  });

  test('should hold a reference to object elements, not make a copy', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const deck = new Deque();
    deck.addLast(item1);
    deck.addLast(item2);
    expect(deck.removeFirst()).toBe(item1);
    expect(deck.removeFirst()).toBe(item2);
  });

  test('toArrayShallow should return a shallow copy of its elements', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const deck = new Deque();
    deck.addLast(item1);
    deck.addLast(item2);
    const arr = deck.toArrayShallow();
    expect(arr[0]).toBe(item1);
    expect(arr[1]).toBe(item2);
  });

  test('toArrayDeep should return a deep copy of its elements', () => {
    const item1 = { age: 42, name: 'Bob' };
    const item2 = { age: 56, name: 'Cindy' };
    const deck = new Deque();
    deck.addFirst(item1);
    deck.addFirst(item2);
    const arr = deck.toArrayDeep() as Array<object>;
    expect(arr[1]).toEqual({ age: 42, name: 'Bob' });
    expect(arr[1]).not.toBe(item1);
    expect(arr[0]).toEqual({ age: 56, name: 'Cindy' });
    expect(arr[0]).not.toBe(item2);
  });

  test('toArrayDeep should return an error if copying fails', () => {
    const item1 = Symbol('sym1');
    const item2 = 42;
    const deck = new Deque();
    deck.addLast(item1);
    deck.addLast(item2);
    const err = deck.toArrayDeep() as Error;
    const errData = err.cause as ErrData;
    expect(err).toBeInstanceOf(Error);
    expect(errData.code).toBe('DeepCopyFailed');
    expect(errData.prevErr).toBeInstanceOf(Error);
    expect(errData.args).toEqual([]);
  });

  test('toString returns a string representation of the deque elements in the correct order', () => {
    const deck = new Deque();
    deck.addLast('item1');
    deck.addLast('item2');
    deck.addFirst('item3');
    deck.addFirst('item4');
    expect(deck.toString()).toContain('item4,item3,item1,item2');
  });
});
