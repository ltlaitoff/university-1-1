import { HeapSort } from './HeapSort'
// import { DoublyLinkedList } from './doubly-linked-list'
import Heap from './heap'
import { Book } from './Book'

// const list = new DoublyLinkedList<number>(1)

// list.addAfter(list.head, 2)
// list.addAfter(list.head, 6)
// list.addAfter(list.head, 7)
// list.addAfter(list.head, 9)

// console.log(list.getPrint((value: number) => String(value)))

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

const heapBook = new Heap<Book>().fromArray(books)

const bookToString = (value: Book, index?: number) => {
	return `${index !== undefined ? index + ' | ' : ''}${value.author} ${
		value.title
	}: ${value.totalCopies - value.copiesCheckedOut} | ${
		value.copiesCheckedOut
	}/${value.totalCopies}`
}

/*
– програмного модуля, який реалізує графічний інтерфейс
відповідної вкладки і дозволяє додавати нові елементи до купи на
основі полів, що відповідають індивідуальному завданню, та на
основі підключення файлів з масивами даних, вилучати існуючі
елементи, виконувати пірамідальне сортування та два інші алгоритми
сортування, визначені індивідуальним завданням, з виведенням
результатів наочним способом (отриманого порядку елементів та часу,
витраченого на сортування).
*/

function renderHeap() {
	heapOutput.textContent = heapBook.getPrint(bookToString)

	console.log(heapBook.getPrint(bookToString))
}

function removeTop() {
	const el = heapBook.extractTop()

	alert(JSON.stringify(el))
	renderHeap()
	// heapOutputTopElement.textContent = el
}

function addElement() {
	const NAMES = [
		'Bartell - Harris',
		'Schoen Inc',
		'Labadie - Rodriguez',
		'Weimann LLC',
		'Veum - Tillman',
		'Willms Inc',
		'Heller, Deckow and Funk',
		'Buckridge, Gutmann and Gaylord',
		'Boehm and Sons',
		'Rempel - Bruen',
		'Boyer, Wisoky and Altenwerth',
		'Steuber, Kovacek and Huels',
		'Ruecker, Jacobs and Daniel',
		'Abbott, Gutkowski and Waelchi',
		'Cartwright - Kuhlman',
		'Maggio - Zboncak',
		'Waelchi Group',
		'Hilll - Bode',
		'Marks - Stroman'
	]

	const TITLES = [
		'Virtual non-volatile toolset',
		'Cloned neutral functionalities',
		'Digitized cohesive flexibility',
		'Face to face systemic utilisation',
		'Operative real-time application',
		'Vision-oriented intermediate collaboration',
		'Versatile modular circuit',
		'Switchable fault-tolerant conglomeration',
		'Implemented methodical matrices',
		'Open-architected bi-directional data-warehouse',
		'Inverse intangible conglomeration',
		'Sharable intangible migration',
		'Re-contextualized system-worthy adapter',
		'Diverse upward-trending core',
		'Streamlined well-modulated framework',
		'Devolved background standardization',
		'Advanced content-based time-frame',
		'Cross-platform local groupware',
		'User-centric foreground middleware'
	]

	const GENRE = [
		'motivating',
		'system-worthy',
		'maximized',
		'client-server',
		'systematic',
		'fresh-thinking',
		'bi-directional',
		'multimedia',
		'global',
		'tertiary',
		'didactic',
		'leading edge',
		'client-driven',
		'empowering',
		'discrete',
		'user-facing',
		'non-volatile',
		'actuating',
		'impactful'
	]

	heapBook.add(
		new Book(
			NAMES[Math.floor(Math.random() * NAMES.length)],
			TITLES[Math.floor(Math.random() * TITLES.length)],
			GENRE[Math.floor(Math.random() * GENRE.length)],
			'SITE.com',
			Math.abs(Math.floor(Math.random() * 5000)),
			Math.abs(Math.floor(Math.random() * 1000)),
			Math.abs(Math.floor(Math.random() * 50)),
			Math.abs(Math.floor(Math.random() * 50))
		)
	)

	renderHeap()
}

function sort() {
	const heapSort = new HeapSort<Book>(heapBook)

	const a = heapSort.getSorted()

	let summ = 0
	const message = [
		'Визначити книжки, кількість наявних екземплярів яких у бібліотеці в поточний момент входить у перші 50 %:\n'
	]

	a.slice(0, a.length / 2).map(item => {
		// Визначити книжки, кількість наявних екземплярів яких у бібліотеці в поточний момент входить у перші 50 %.
		message.push(bookToString(item))

		summ += Number(item)
	})

	// Обчислити сумарну кількість наявних екземплярів таких книжок.
	message.push('\nSumm: ' + summ)

	alert(message.join('\n'))
}

const heapOutput = document.querySelector('#output')
const heapOutputTopElement = document.querySelector('#output-element')

document.querySelector('#extract-top')?.addEventListener('click', () => {
	removeTop()
})

document.querySelector('#add-element')?.addEventListener('click', () => {
	addElement()
})

document.querySelector('#sort')?.addEventListener('click', () => {
	sort()
})

renderHeap()
