class DoublyLinkedListItem<T> {
	previous: DoublyLinkedListItem<T> | null = null
	value: T
	next: DoublyLinkedListItem<T> | null = null

	constructor(
		value: T,
		previous: DoublyLinkedListItem<T> | null = null,
		next: DoublyLinkedListItem<T> | null = null
	) {
		this.value = value
		this.previous = previous
		this.next = next
	}
}

/*
Клас, що реалізує двозв’язний список, має дозволяти
виконувати наступні операції на основі окремих методів: 
[x] додавання вузла в початок списку
[x] додавання вузла після заданого
[x] пошук вузла в списку
[x] видалення вузла
[ ] виведення вузлів на екран з початку та з кінця.
*/

class DoublyLinkedList<T> {
	head: DoublyLinkedListItem<T>

	constructor(value: T) {
		this.head = new DoublyLinkedListItem(value)
	}

	addAsHead(value: T) {
		const newHead = new DoublyLinkedListItem(value, null, this.head)
		this.head.previous = newHead

		this.head = newHead
	}

	addAfter(node: DoublyLinkedListItem<T>, value: T) {
		const newNode = new DoublyLinkedListItem(value, node, node.next)

		node.next = newNode

		if (newNode.next) {
			newNode.next.previous = newNode
		}

		return this
	}

	find(value: T): DoublyLinkedListItem<T> | null {
		let current: DoublyLinkedListItem<T> | null = this.head

		while (current !== null) {
			if (current.value === value) {
				return current
			}

			current = current.next
		}

		return null
	}

	delete(node: DoublyLinkedListItem<T>) {
		if (node.previous === null && node.next === null) return

		if (node === this.head) {
			if (this.head.next === null) {
				throw new Error('List must have minimum one node - head')
			}

			if (this.head.next !== null) {
				this.head = this.head.next
				this.head.previous = null

				node.next = null
				return
			}
		}

		if (node.previous === null) {
			console.log('What? How?!')
			return
		}

		node.previous.next = node.next

		if (node.next) {
			node.next.previous = node.previous
		}
	}

	getPrint(valueToString: (value: T) => string) {
		const result: string[] = []

		let current: DoublyLinkedListItem<T> | null = this.head

		while (current !== null) {
			result.push(valueToString(current.value))

			current = current.next
		}

		return result.join(' ⇄ ')
	}
}

export { DoublyLinkedList }
