import AVLTree from './AVLTree.class'
import HashTable from './HashTable.class'
import { logTree } from './helper/logTree'

/*
– програмного модуля, що реалізує графічний інтерфейс
відповідної вкладки і дозволяє виконувати формування геш-таблиці та
B-дерева, додавання і видалення елементів, пошук, оброблення
результатів, виведення їх у відповідні поля для виконання
індивідуального завдання, при цьому розв’язуючи одне з завдань за
допомогою обох структур даних.
*/

console.log('Var 8 => Task 1 В)')
/*
В. Створити геш-таблицю, що використовує метод ланцюжків
для розв’язання колізій та геш-функцію множення. Геш-таблицю
заповнити на основі виділення інформації з текстового файлу, в якому
містяться прізвища, ім’я і по батькові співробітників фірми та займані
ними посади. Визначити посаду заданого співробітника.

*/

const hashData = [
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
	['Taylor Kreiger Kihn', 'Functionality']
]

const hashTableOutput = document.querySelector('#hash-table')
const hashOutput = document.querySelector('#hash-output')
const hashAdd = document.querySelector('#hash-add')

const hashTable = new HashTable()

hashData.map(([name, job]) => {
	hashTable.addOrUpdate(name, transformDataToHTML([name, job], false))
})

function transformDataToHTML(data: string[], withWrapper = true) {
	const name = `<div class="hash__item hash__item--name">${data[0]}</div>`
	const job = `<div class="hash__item hash__item--job">${data[1]}</div>`

	if (withWrapper) return `<div class="hash">${name}${job}</div>`
	return `${name}${job}`
}

function renderData() {
	hashTableOutput.innerHTML = hashData
		.map(item => transformDataToHTML(item))
		.join('\n')
}

function renderHash() {
	hashOutput.innerHTML = hashTable
		.show()
		.map(item => {
			if (!item) return ''

			return `<div class="hash">
				<div class="hash__item hash__item--index">${item.index}</div>
				<div class="hash__item hash__item--other">|</div>
				${item.value}
			</div>`
		})
		.join('')
}

/*
програмного модуля, що реалізує графічний інтерфейс
відповідної вкладки і дозволяє виконувати формування геш-таблиці та
B-дерева, додавання і видалення елементів, пошук, оброблення
результатів, виведення їх у відповідні поля для виконання
індивідуального завдання, при цьому розв’язуючи одне з завдань за
допомогою обох структур даних.
*/

renderData()
renderHash()

hashAdd?.addEventListener('click', () => {
	addHash()
})

function addHash() {
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

	const data = [
		`${TITLES[Math.floor(Math.random() * TITLES.length)]}`,
		GENRE[Math.floor(Math.random() * GENRE.length)]
	]

	hashData.push(data)

	hashTable.addOrUpdate(data[0], transformDataToHTML(data, false))

	renderHash()
	renderData()
}

/*
	2 Б) Дані про власників автомобілів включають ідентифікаційний
	номер транспортного засобу, дату реєстрації та власника (прізвище,
	ім’я, по батькові). Сформувати дерево з інформації про власників
	автомобілів. Реалізувати пошук інформації про автомобіль за заданим
	ідентифікаційним номером транспортного засобу, визначення осіб, які
	володіють більше ніж одним автомобілем.
*/

class CarOwner {
	id: number
	registerDate: Date
	owner: string

	constructor(id: number, registerDate: Date, owner: string) {
		this.id = id
		this.registerDate = registerDate
		this.owner = owner
	}
}

const carOwners = [
	new CarOwner(67324, new Date('Sun Jan 06 2075 23:37:10'), 'Alexandra Becker'),
	new CarOwner(29497, new Date('Tue May 03 2016 23:40:18'), 'Mr. Lela Kessler'),
	new CarOwner(22486, new Date('Tue Apr 28 2020 02:28:00'), 'Roosevelt Crooks'),
	new CarOwner(85849, new Date('Tue Jan 13 2054 10:55:12'), 'Cory Schowalter'),
	new CarOwner(74389, new Date('Sat Aug 05 2017 19:04:01'), 'Wendell Hessel'),
	new CarOwner(44563, new Date('Tue Oct 05 2094 03:34:48'), 'Joe Lesch'),
	new CarOwner(61297, new Date('Fri Dec 21 2012 16:56:12'), 'Karla Simonis'),
	new CarOwner(53376, new Date('Mon Nov 05 2074 12:16:53'), 'Marty Beahan'),
	new CarOwner(5613, new Date('Sat Jan 26 2069 01:07:46'), 'Kim Lockman'),
	new CarOwner(15435, new Date('Sun Dec 17 1995 18:56:09'), 'Mr. Victor Kunze'),
	new CarOwner(15673, new Date('Wed Sep 17 2053 01:54:01'), 'Arturo Robel IV'),
	new CarOwner(63325, new Date('Fri Sep 02 2033 01:25:31'), 'Ms. Donna Kessler')
]

const treeOutput = document.querySelector('#tree-output')

const binaryTree = new AVLTree<CarOwner>()

carOwners.map(item => {
	binaryTree.insert(item.id, item)
})

function treeRender() {
	treeOutput.textContent = logTree(binaryTree.treeForOutput())
}

treeRender()

document.querySelector('#tree-delete')?.addEventListener('click', () => {
	binaryTree.delete(binaryTree.headNode?.value)

	treeRender()
})

document.querySelector('#tree-add')?.addEventListener('click', () => {
	const id = Math.floor(Math.random() * 500)

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

	binaryTree.insert(
		id,
		new CarOwner(
			id,
			new Date(),
			GENRE[Math.floor(Math.random() * GENRE.length)]
		)
	)

	treeRender()
})

// console.log('Tree structure after delete 4 items:')
// console.log(logTree(binaryTree.treeForOutput()))

// console.log("Find 5613, 61297 and 44563 id's:")
// console.table([
// 	binaryTree.search(5613),
// 	binaryTree.search(61297),
// 	binaryTree.search(44563)
// ])
