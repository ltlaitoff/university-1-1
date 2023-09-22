/*
Клас, що реалізує купу (чергу з пріоритетами), має
дозволяти виконувати наступні операції на основі окремих методів:
[x] вставлення елементу
[x] побудова купи з невпорядкованого масиву 
[x] видалення елементу
[x] сортування елементів
[ ] виведення елементів на екран
*/

import { Book } from './Book'
import { logHeap } from './helpers/logHeap'

class Heap<T> {
	private heap: T[] = []

	add(element: T) {
		const index = this.heap.push(element)

		this.siftup(index)

		return this
	}

	fromArray(array: T[]) {
		this.heap = array

		this.heap.forEach((_, index) => {
			this.siftdown(this.heap, this.heap.length - 1 - index)
		})

		return this
	}

	extractTop(heap: T[] = this.heap) {
		const last = heap.length - 1

		;[heap[0], heap[last]] = [heap[last], heap[0]]

		const element = heap.pop() as T

		this.siftdown(heap, 0)

		return element
	}

	getSortedArray() {
		const heapCopy = this.heap.map(item => {
			if (item instanceof Book) {
				return item.clone()
			}

			return { ...item }
		}) as T[]

		const result: T[] = []

		while (heapCopy.length >= 1) {
			result.push(this.extractTop(heapCopy))
		}

		return result
	}

	getPrint(toString: (value: T) => string) {
		console.log(logHeap<T>(this.heap, toString))
	}

	private siftup(i: number) {
		let parent = Math.floor(i - 1 / 2)

		while (i !== 0 && Number(this.heap[i]) < Number(this.heap[parent])) {
			;[this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]]

			i = parent
			parent = Math.floor(i - 1 / 2)
		}
	}

	private siftdown(heap: T[], i: number) {
		let left = i * 2 + 2
		let right = i * 2 + 1

		while (
			(left < heap.length && Number(heap[i]) > Number(heap[left])) ||
			(right < heap.length && Number(heap[i]) > Number(heap[right]))
		) {
			let smallest = right

			if (right >= heap.length || Number(heap[left]) < Number(heap[right])) {
				smallest = left
			}

			;[heap[i], heap[smallest]] = [heap[smallest], heap[i]]
			i = smallest
			left = i * 2 + 2
			right = i * 2 + 1
		}
	}
}

export default Heap
