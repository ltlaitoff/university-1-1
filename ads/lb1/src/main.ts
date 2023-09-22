import { HeapSort } from './HeapSort'
import { DoublyLinkedList } from './doubly-linked-list'
import Heap from './heap'
import { Book } from './Book'

const list = new DoublyLinkedList<number>(1)

list.addAfter(list.head, 2)
list.addAfter(list.head, 6)
list.addAfter(list.head, 7)
list.addAfter(list.head, 9)

console.log('DoublyLinkedList: ')
console.log(list.getPrint((value: number) => String(value)))
console.log('')

const books = [
	new Book(
		'Camille Predovic',
		'Armenian Gampr dog',
		'Electronics',
		'weepy-status.org',
		2022,
		213,
		11,
		5
	),
	new Book(
		'Chris Von',
		'Black Norwegian Elkhound',
		'Automotive',
		'illiterate-antigen.biz',
		2001,
		308,
		24,
		6
	),
	new Book(
		'Alonzo Fahey II',
		'Pekingese',
		'Outdoors',
		'concrete-dashboard.org',
		2021,
		399,
		50,
		43
	),
	new Book(
		'Fred Buckridge',
		'Fila Brasileiro',
		'Outdoors',
		'glamorous-relative.org',
		2011,
		208,
		11,
		7
	),
	new Book(
		'Colin O`Connell',
		'Armant',
		'Beauty',
		'graceful-territory.com',
		2018,
		365,
		38,
		30
	),
	new Book(
		'Shelly Greenfelder',
		'Hygen Hound',
		'Games',
		'quirky-mother-in-law.com',
		2010,
		355,
		24,
		6
	),
	new Book(
		'Margarita Franecki Jr.',
		'Bracco Italiano',
		'Home',
		'direct-lymphocyte.name',
		2021,
		302,
		25,
		12
	),
	new Book(
		'Margaret Hills',
		'Montenegrin Mountain Hound',
		'Baby',
		'attached-wake.name',
		2002,
		423,
		41,
		33
	),
	new Book(
		'Julio Nikolaus',
		'Silky Terrier',
		'Electronics',
		'ragged-jelly.name',
		2006,
		321,
		46,
		37
	),
	new Book(
		'Alan Gibson I',
		'Lancashire Heeler',
		'Sports',
		'definite-garbage.com',
		2006,
		356,
		44,
		4
	)
]

console.log('Individual with heap(Variant #8): ')

const heapBook = new Heap<Book>().fromArray(books)

const bookToString = (value: Book, index?: number) => {
	return `${index !== undefined ? index + ' | ' : ''}${value.author} \x1b[33m${
		value.title
	}\x1b[0m: \x1b[32m${value.totalCopies - value.copiesCheckedOut}\x1b[0m | ${
		value.copiesCheckedOut
	}/${value.totalCopies}`
}

books.map((item, index) => {
	console.log(bookToString(item, index))
})

console.log('')

heapBook.getPrint(bookToString)

const heapSort = new HeapSort<Book>(heapBook)

const a = heapSort.getSorted()

let summ = 0

a.slice(0, a.length / 2).map(item => {
	// Визначити книжки, кількість наявних екземплярів яких у бібліотеці в поточний момент входить у перші 50 %.
	console.log(bookToString(item))

	summ += Number(item)
})

// Обчислити сумарну кількість наявних екземплярів таких книжок.
console.log('\nSumm: ' + summ)
