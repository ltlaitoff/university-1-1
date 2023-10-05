import AVLTree from './AVLTree.class'
import HashTable from './HashTable.class'
import { logTree } from './helper/logTree'
import * as fs from 'fs'

console.log('Var 8 => Task 1 В)')
/*
В. Створити геш-таблицю, що використовує метод ланцюжків
для розв’язання колізій та геш-функцію множення. Геш-таблицю
заповнити на основі виділення інформації з текстового файлу, в якому
містяться прізвища, ім’я і по батькові співробітників фірми та займані
ними посади. Визначити посаду заданого співробітника.
*/

const hashData = JSON.parse(fs.readFileSync('./src/data/task1.json', 'utf8'))

const hashTable = new HashTable()

const start = []
hashData.map(([name, job], index) => {
	start.push({ name, job })
	hashTable.addOrUpdate(`${index} - ${name}`, job)
})

console.log('Data from file:')
console.table(start)
console.log()

console.log('How save in HashTable:')
console.table(hashTable.show())
console.log()

hashTable.addOrUpdate(`24 - Tara Cremin Skiles`, 'Accountability')

console.log(
	'How save in HashTable after add "24 - Tara Cremin Skiles: Accountability" people:'
)
console.table(hashTable.show())
console.log()

console.log("Search '13 - Javier Kilback Rodriguez' value: ")
console.log('value = ', hashTable.get('13 - Javier Kilback Rodriguez'))

console.log('\n ====================\n')
console.log('Var 8 => Task 2 Б)')
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

const binaryTree = new AVLTree<CarOwner>()

carOwners.map(item => {
	binaryTree.insert(item.id, item)
})

console.log('Tree structure after creating:')
console.log(logTree(binaryTree.treeForOutput()))

binaryTree.delete(74389)
binaryTree.delete(29497)
binaryTree.delete(53376)
binaryTree.delete(15673)

console.log('Tree structure after delete 4 items:')
console.log(logTree(binaryTree.treeForOutput()))

console.log("Find 5613, 61297 and 44563 id's:")
console.table([
	binaryTree.search(5613),
	binaryTree.search(61297),
	binaryTree.search(44563)
])
