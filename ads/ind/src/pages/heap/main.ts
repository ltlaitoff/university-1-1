/*
2.3 Для реалізації вкладки «Пірамідальне сортування»
розв’язати індивідуальне завдання за допомогою пірамідального
сортування, яке повинно забезпечуватися за допомогою:
– програмного модуля, що містить клас, який реалізує купу і має
дозволяти виконувати наступні операції на основі окремих методів:
вставлення елементу, сортування елементів, побудова купи з
невпорядкованого масиву, видалення елементу, сортування елементів
із використанням купи;

– програмного модуля, який реалізує графічний інтерфейс
відповідної вкладки і дозволяє 

додавати нові елементи до купи на основі полів, що відповідають індивідуальному завданню, 
та на основі підключення файлів з масивами даних, 
вилучати існуючі елементи, 
виконувати пірамідальне сортування та два інші алгоритми сортування, визначені індивідуальним завданням, 
з виведенням результатів наочним способом (отриманого порядку елементів та часу, витраченого на сортування).
*/

import { HeapSort } from './HeapSort'
// import { DoublyLinkedList } from './doubly-linked-list'
import Heap from './heap'
import { Book } from './Book'
import { randomGenerateBook } from './randomGenerate'

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
	//  <div class="heap__item heap__item--index">${index ?? ''}</div>

	return `<div class="heap">
			<div class="heap__item heap__item--author">${value.author}</div>
			<div class="heap__item heap__item--title">${value.title}</div>
			<div class="heap__item heap__item--wrapper">
			<div class="heap__item--total">${value.totalCopies}</div>
			<div class="heap__item--other">-</div>
			<div class="heap__item--checked-out">${value.copiesCheckedOut}</div>
				<div class="heap__item--other">=</div>
				<div class="heap__item--avalible">${
					value.totalCopies - value.copiesCheckedOut
				}</div>
			</div>
		</div>`
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

Індивідуальне завдання:

Варіант No 8
Книжки в бібліотеці характеризуються наступними даними:
– автор;
– назва;
– жанр;
– видавництво;
– рік публікації;
– кількість сторінок;
– загальна кількість екземплярів;
– кількість екземплярів у читачів.

Визначити книжки, кількість наявних екземплярів яких у
бібліотеці в поточний момент входить у перші 50 %. Обчислити
сумарну кількість наявних екземплярів таких книжок.
*/

function renderHeap() {
	try {
		heapOutput.innerHTML = heapBook.getPrint(bookToString)
	} catch (error) {
		heapOutput.innerHTML = ''
	}
}

function extractTop() {
	const el = heapBook.extractTop()

	if (el) {
		extractedContent.innerHTML = `<div class="heap">
			<div class="heap__item heap__item--author">${el.author}</div>
			<div class="heap__item heap__item--title">${el.title}</div>
			<div class="heap__item heap__item--wrapper">
				<div class="heap__item--checked-out">${el.copiesCheckedOut}</div>
				<div class="heap__item--other">/</div>
				<div class="heap__item--total">${el.totalCopies}</div>
				<div class="heap__item--other">=</div>
				<div class="heap__item--avalible">${el.totalCopies - el.copiesCheckedOut}</div>
			</div>
		</div>`
	} else {
		extractedContent.innerHTML = ''
	}

	renderHeap()
}

function addRandomElement() {
	heapBook.add(randomGenerateBook())
	renderHeap()
}

function addElementFromForm(e: Event) {
	e.preventDefault()

	heapBook.add(
		new Book(
			formAddAuthor.value,
			formAddTitle.value,
			formAddGenre.value,
			formAddPublisher.value,
			Number(formAddPublicationYear.value),
			Number(formAddPageCount.value),
			Number(formAddTotalCopies.value),
			Number(formAddCopiesCheckedOut.value)
		)
	)

	renderHeap()
}

function heapSort() {
	const heapSort = new HeapSort<Book>(heapBook)

	const sorted = heapSort.getSorted()

	let summ = 0
	const message = [
		'Визначити книжки, кількість наявних екземплярів яких у бібліотеці в поточний момент входить у перші 50 %:\n'
	]

	sorted
		.toReversed()
		.slice(0, sorted.length / 2)
		.map(item => {
			message.push(bookToString(item))

			summ += Number(item)
		})

	message.push('\nSumm: ' + summ)

	heapSortContent.innerHTML = message.join('\n')
}

const heapOutput = document.querySelector('#output') as HTMLElement
const extractedContent = document.querySelector(
	'#extracted__content'
) as HTMLElement
const extractTopButton = document.querySelector('#extract-top') as HTMLElement
const heapSortButton = document.querySelector('#heap-sort') as HTMLElement
const addRandomElementButton = document.querySelector(
	'#add-random-element'
) as HTMLElement

const heapSortContent = document.querySelector(
	'#heap-sort__content'
) as HTMLElement

const addElementButton = document.querySelector('#add') as HTMLElement
const addForm = document.querySelector('#add-form') as HTMLFormElement

const formAddAuthor = document.querySelector(
	'#form-add-author'
) as HTMLInputElement
const formAddTitle = document.querySelector(
	'#form-add-title'
) as HTMLInputElement
const formAddGenre = document.querySelector(
	'#form-add-genre'
) as HTMLInputElement
const formAddPublisher = document.querySelector(
	'#form-add-publisher'
) as HTMLInputElement
const formAddPublicationYear = document.querySelector(
	'#form-add-publicationYear'
) as HTMLInputElement
const formAddPageCount = document.querySelector(
	'#form-add-pageCount'
) as HTMLInputElement
const formAddTotalCopies = document.querySelector(
	'#form-add-totalCopies'
) as HTMLInputElement
const formAddCopiesCheckedOut = document.querySelector(
	'#form-add-copiesCheckedOut'
) as HTMLInputElement

function toggleAddForm() {
	if (addForm.classList.contains('add-form--hide')) {
		formAddAuthor.value = ''
		formAddTitle.value = ''
		formAddGenre.value = ''
		formAddPublisher.value = ''
		formAddPublicationYear.value = ''
		formAddPageCount.value = ''
		formAddTotalCopies.value = ''
		formAddCopiesCheckedOut.value = ''
		addForm.classList.remove('add-form--hide')
		return
	}

	addForm.classList.add('add-form--hide')
}

extractTopButton.addEventListener('click', extractTop)
addRandomElementButton.addEventListener('click', addRandomElement)
heapSortButton.addEventListener('click', heapSort)
addElementButton.addEventListener('click', toggleAddForm)
addForm.addEventListener('submit', addElementFromForm)

renderHeap()
