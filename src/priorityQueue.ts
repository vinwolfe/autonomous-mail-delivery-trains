interface INode {
    value: string;
    priority: number;
};

// CustomNode class implements the INode interface for priority queue nodes
class CustomNode implements INode {
	value: string;
	priority: number;
	
    // Constructor initialises a new node with a value and priority
	constructor(value: string, priority: number) {
        if (typeof value !== 'string' || typeof priority !== 'number') {
            throw new Error("Invalid arguments: 'val' must be a string and 'priority' must be a number.");
        }
		this.value = value;
		this.priority = priority;
	}
}

export class PriorityQueue {
    values: CustomNode[];

    constructor() {
        this.values = []; // Initialise an empty array to store nodes
    }

    // Peek method to look at the first element in the queue without removing it
    peek() {
        if (this.values.length === 0) {
            throw new Error('Cannot peek from an empty queue.');
        }
        return this.values[0];
    }

    // Check if the queue is empty
    isEmpty() {
        return this.values.length === 0;
    }

    // Enqueue method adds a new node to the queue based on its priority
    enqueue(val: string, priority: number) {
        if (typeof val !== 'string' || typeof priority !== 'number') {
            throw new Error('Invalid input');
        }
        const newNode = new CustomNode(val, priority); // Create a new node
        this.values.push(newNode); // Add the new node to the end of the array
        this.bubbleUp(); // Adjust the position of the new node based on its priority
    }

    // Dequeue method removes and returns the highest priority node from the queue
    dequeue() {
        const length = this.values.length;
        if (length === 0) {
            throw new Error("Cannot dequeue from an empty queue.");
        }

        const min = this.values[0]; // Store the first element to return later
        const end = this.values[length - 1];
        this.values.pop(); // Remove the last element

        if (length > 1) {
            this.values[0] = end; // Replace the first element with the last
            this.sinkDown(); // Adjust the heap to maintain priority queue properties
        }

        return min; // Return the removed element
    };

    // BubbleUp method adjusts the heap to maintain priority queue properties after adding a new node
    private bubbleUp() {
        let idx = this.values.length - 1; // Start with the last element
        const element = this.values[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2); // Calculate parent index
            let parent = this.values[parentIdx];
            if (element.priority >= parent.priority) break; // Stop if the parent's priority is higher
            
            // Swap the current element with its parent
            this.values[parentIdx] = element;
            this.values[idx] = parent;
            idx = parentIdx; // Move up to the parent's index
        }
    };

    // SinkDown method adjusts the heap after removing the highest priority node
    private sinkDown() {
        let idx = 0;
        const length = this.values.length;
        const element = this.values[0];
        while (true) {
            let leftChildIdx = 2 * idx + 1; // Calculate left child index
            let rightChildIdx = 2 * idx + 2; // Calculate right child index
            let swapIdx = null;
            let leftChild, rightChild;

            // Check if left child exists and should be swapped
            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swapIdx = leftChildIdx;
                }
            }

            // Check if right child exists and should be swapped
            if (rightChildIdx < length) {
                rightChild = this.values[rightChildIdx];
                if (
                    (swapIdx === null && rightChild.priority < element.priority) ||
                    (swapIdx !== null && leftChild && rightChild.priority < leftChild.priority)
                ) {
                    swapIdx = rightChildIdx;
                }
            }

            if (swapIdx === null) break; // If no swap needed, exit loop

            // Perform the swap
            this.values[idx] = this.values[swapIdx];
            this.values[swapIdx] = element;
            idx = swapIdx; // Update current index to the swap index
        }
    }
}

