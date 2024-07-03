import { PriorityQueue } from './priorityQueue';

describe('PriorityQueue', () => {
  let queue: PriorityQueue;

  beforeEach(() => {
    queue = new PriorityQueue();
  });

  test('enqueue adds items in the correct order', () => {
    queue.enqueue('low priority', 5);
    queue.enqueue('high priority', 1);
    expect(queue.dequeue()).toEqual({ value: 'high priority', priority: 1 });
  });

  test('dequeue removes and returns the highest priority item', () => {
    queue.enqueue('item1', 2);
    queue.enqueue('item2', 1);
    expect(queue.dequeue()).toEqual({ value: 'item2', priority: 1 });
    expect(queue.dequeue()).toEqual({ value: 'item1', priority: 2 });
  });

  test('peek returns the highest priority item without removing it', () => {
    queue.enqueue('item', 1);
    expect(queue.peek()).toEqual({ value: 'item', priority: 1 });
    expect(queue.dequeue()).toEqual({ value: 'item', priority: 1 });
  });

  test('isEmpty returns true for an empty queue and false for a non-empty queue', () => {
    expect(queue.isEmpty()).toBe(true);
    queue.enqueue('item', 1);
    expect(queue.isEmpty()).toBe(false);
  });

  test('dequeue throws an error when called on an empty queue', () => {
    expect(() => queue.dequeue()).toThrow('Cannot dequeue from an empty queue.');
  });
});