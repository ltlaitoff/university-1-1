/*
- [ ] Вставлення елементу
- [ ] Видалення елементу
- [ ] Пошук елементу
- [ ] Відображення структури геш-таблиці на основі використання параметрів, обраних у відповідності з варіантом індивідуального завдання з п. 2.3.4.
*/
type KeyType = number | string

class List {
	private key: KeyType
	private value: unknown
	public next: List | null

	addOrUpdate(key: KeyType, value: unknown) {
		if (this.key == undefined || this.value == undefined || this.key === key) {
			this.key = key
			this.value = value
			return this
		}

		if (this.next) {
			this.next.addOrUpdate(key, value)
			return this
		}

		this.next = new List().addOrUpdate(key, value)
	}

	get(key: KeyType): unknown | null {
		if (this.key === key) {
			return this.value
		}

		if (!this.next) return null

		return this.next.get(key)
	}

	remove(key: KeyType): List | null {
		const dummy = new List()
		dummy.next = this.next

		let prev = dummy

		let current = new List()

		if (this.key === key) {
			prev.next = current.next
			current = current.next
		} else {
			prev = current
			current = current.next
		}

		while (current) {
			if (current.key === key) {
				prev.next = current.next

				current = current.next
			} else {
				prev = current
				current = current.next
			}
		}

		return dummy.next
	}

	__getInfoWithRemove(): null | [KeyType, unknown, List | null] {
		this.remove(this.key)

		return [this.key, this.value, this.next]
	}

	getShow(): string[] {
		if (this.next == null) return [String(this)]

		return [String(this), ...this.next.getShow()]
	}

	toString() {
		return `${this.key}: ${this.value}`
	}
}

class HashTable {
	constructor(typeOfFunction: 'task' | 'my' = 'task') {
		this.typeOfFunction = typeOfFunction
	}

	private typeOfFunction = 'task'
	private readonly sizes: number[] = [
		5, 11, 23, 47, 97, 193, 389, 769, 1543, 3072, 3079, 12289, 24593, 49157,
		98317, 196613, 393241, 786433, 1572869, 3145739, 6291469, 12582917,
		25165843, 50331653, 100663319, 201326611, 402653189, 805306457, 1610612736,
		2147483629
	]
	private sizes_index: number = 0
	private factor = 0.75
	private count: number = 0

	private values: List[] = Array(this.sizes[this.sizes_index])

	addOrUpdate(key: KeyType, value: unknown) {
		if (this.checkMemory()) {
			console.time('addMemory')
			this.addMemory()
			console.timeEnd('addMemory')
		}

		const index = this.getIndex(key)

		// if (type === "task") {}
		console.log('%c⧭', 'color: #ffa640', this.typeOfFunction, index, key)

		if (this.values[index] == null) {
			this.values[index] = new List()
			this.count++
		}

		this.values[index].addOrUpdate(key, value)
	}

	get(key: KeyType) {
		const index = this.getIndex(key)

		if (this.values[index] == null) {
			return null
		}

		return this.values[index].get(key)
	}

	remove(key: KeyType) {
		const index = this.getIndex(key)

		if (this.values[index] == null) {
			return null
		}

		const removeResult = this.values[index].remove(key)

		if (removeResult !== null) {
			this.values[index] = removeResult
			return null
		}

		this.values[index] = null
	}

	show() {
		// return this.values
		return this.values
			.map((item, index) => {
				if (item) return item.getShow()
			})
			.filter(item => item != undefined)
		// .reduce((acc, item) => {
		// 	return [...acc, ...item]
		// }, [])

		// return this.values
		// return ''
	}

	private getHash(key: KeyType): number {
		const value = typeof key === 'number' ? key : this.stringToNumber(key)

		if (this.typeOfFunction === 'my') {
			return value
		}

		const w = 14
		const A = Math.sqrt(5) / 2 ** w
		const M = 2 ** 6

		const resultOfMultiple = value * A

		return Math.ceil(M * (resultOfMultiple % 1))
	}

	private stringToNumber(key: string) {
		let hash = 0

		for (let i = 0; i < key.length; i++) {
			hash = (hash << 5) - hash + key.charCodeAt(i)
		}

		return Math.abs(hash)
	}

	private getIndex(key: KeyType): number {
		const hash = this.getHash(key)

		return hash % this.sizes[this.sizes_index]
	}

	private checkMemory() {
		return this.count / this.sizes[this.sizes_index] >= this.factor
	}

	private addMemory() {
		this.count = 0
		const oldValues = [...this.values]

		this.sizes_index += 1

		this.values = Array(this.sizes[this.sizes_index])

		for (let i = 0; i < this.sizes[this.sizes_index - 1]; i++) {
			if (!oldValues[i]) continue

			let node = oldValues[i].__getInfoWithRemove()
			console.log('%c⧭ node main: ', 'color: #00b300', node)

			while (node != null) {
				this.addOrUpdate(node[0], node[1])

				if (node[2] == null) {
					break
				}

				node = node[2].__getInfoWithRemove()
			}
		}
	}
}

/*
Створити геш-таблицю, що використовує метод ланцюжків
для розв’язання колізій та геш-функцію множення. Геш-таблицю
заповнити на основі виділення інформації з текстового файлу, в якому
містяться прізвища, ім’я і по батькові співробітників фірми та займані
ними посади. Визначити посаду заданого співробітника.
*/

const DATA = [
	['Loy Graham Zboncak', 'Directives'],
	['Roy Breitenberg Runte', 'Accountability'],
	['Erika Emard Feest', 'Security'],
	['Vance Flatley Thiel', 'Research'],
	['Mallory Hoppe O`Hara', 'Applications'],
	['Dulce Douglas Boyer', 'Interactions'],
	['Dedrick Jerde Kozey', 'Accounts'],
	['Hudson Langosh Mayert', 'Applications'],
	['Georgianna Bergstrom VonRueden', 'Solutions'],
	['Marjorie Rolfson Bashirian', 'Integration'],
	['Mitchell O`Keefe Shanahan', 'Branding'],
	['Filiberto Gottlieb Marquardt', 'Accountability'],
	['Murphy Cassin Franey', 'Configuration'],
	['Javier Kilback Rodriguez', 'Branding'],
	['Kayley Powlowski Kuphal', 'Assurance'],
	['Liliana Johnston Ebert', 'Metrics'],
	['Everette Little Cartwright', 'Accounts'],
	['Otilia Fadel Spinka', 'Implementation'],
	['Watson Schuppe Lowe', 'Web'],
	['Duane Emmerich Rohan', 'Paradigm'],
	['Linwood Huel VonRueden', 'Marketing'],
	['Toni Johns Wiegand', 'Accounts'],
	['Taylor Kreiger Kihn', 'Functionality'],
	['Coby Sauer Littel', 'Division']
]

const th = new HashTable()
const thMy = new HashTable('my')

const start = []
DATA.map(([name, job], index) => {
	// console.log(index, [name, job])
	start.push(`${index} - ${name}`)
	th.addOrUpdate(`${index} - ${name}`, job)
	// thMy.addOrUpdate(`${index} - ${name}`, job)
})

console.log('start', start)

// th.addOrUpdate('test', 'test')
// console.log('test', th.show())

// th.addOrUpdate('asdftest', 'asdftest')
// console.log('asdftest', th.show())

// th.addOrUpdate('asdftest', 'h45578')
// console.log('asdftest', th.show())

// th.addOrUpdate('56', '56')
// console.log('56', th.show())

// th.remove('56')
// console.log('56 remove', th.show())

// th.addOrUpdate('sdf', 'sdf')

// console.log('sdf', th.show())

// th.addOrUpdate(6, '6')
// console.log(6, th.show())

// th.addOrUpdate(8, 'b')
console.log('task')
console.log(
	th
		.show()
		.flat(Infinity)
		.sort((a: string, b: string) => {
			const aNumber = Number(a.split(' - ')[0])
			const bNumber = Number(b.split(' - ')[0])

			return aNumber - bNumber
		})
)

console.log('my')
console.log(
	thMy
		.show()
		.flat(Infinity)
		.sort((a: string, b: string) => {
			const aNumber = Number(a.split(' - ')[0])
			const bNumber = Number(b.split(' - ')[0])

			return aNumber - bNumber
		})
)

export default HashTable
