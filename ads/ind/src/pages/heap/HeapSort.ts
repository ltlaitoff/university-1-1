import Heap from './heap'

class HeapSort<T> {
	heap: Heap<T>

	constructor(heap: Heap<T>) {
		this.heap = heap
	}

	getSorted() {
		return this.heap.getSortedArray()
	}
}

export { HeapSort }
