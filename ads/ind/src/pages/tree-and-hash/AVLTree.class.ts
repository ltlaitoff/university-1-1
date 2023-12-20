import { LogTreeNode } from './helper/logTree'

/*
- [x] створення порожнього дерева
- [x] відображення структури дерева
- [x] пошук у дереві
- [x] вставлення ключа
- [x] видалення ключа
*/

class TreeNode<T> {
	key: number
	value: T
	left: TreeNode<T> | null = null
	right: TreeNode<T> | null = null

	height = 0

	constructor(key: number, value: T) {
		this.key = key
		this.value = value
	}

	insert(node: TreeNode<T>, key: number, value: T) {
		if (key < node.key) {
			if (node.left === null) {
				node.left = new TreeNode<T>(key, value)
			} else {
				this.insert(node.left, key, value)
			}
		} else if (node.right === null) {
			node.right = new TreeNode(key, value)
		} else {
			this.insert(node.right, key, value)
		}

		this.updateHeight(node)
		this.balance(node)
	}

	search(node: TreeNode<T>, key: number) {
		if (node === null) return null
		if (node.key === key) return node
		return key < node.key
			? this.search(node.left, key)
			: this.search(node.right, key)
	}

	getMin(node: TreeNode<T>): TreeNode<T> | null {
		if (node === null) return null
		if (node.left === null) return node

		return this.getMin(node.left)
	}

	getMax(node: TreeNode<T>): TreeNode<T> | null {
		if (node === null) return null
		if (node.right === null) return node

		return this.getMax(node.right)
	}

	delete(node: TreeNode<T>, key: number) {
		if (node === null) return null
		if (key < node.key) node.left = this.delete(node.left, key)
		else if (key > node.key) node.right = this.delete(node.right, key)
		else {
			if (node.left === null || node.right === null) {
				node = node.left === null ? node.right : node.left
			} else {
				const maxInLeft = this.getMax(node.left)

				node.key = maxInLeft.key
				node.value = maxInLeft.value

				node.left = this.delete(node.left, maxInLeft.key)
			}
		}

		if (node !== null) {
			this.updateHeight(node)
			this.balance(node)
		}

		return node
	}

	treeForOutput(node: TreeNode<T>) {
		if (node === null) return

		const left = this.treeForOutput(node.left)
		const right = this.treeForOutput(node.right)

		const EMPTY_NAME = ''
		let children = [left, right].map(item => {
			if (item !== undefined) return item

			return {
				name: EMPTY_NAME
			}
		})

		if (children[0].name === EMPTY_NAME && children[1].name === EMPTY_NAME) {
			children = []
		}

		const result: LogTreeNode = {
			name: String(node.key)
		}

		if (children.length > 0) {
			result.children = children
		}

		return result
	}

	// Симетричний обхід
	inorderTreeWalkPrint(node: TreeNode<T>) {
		if (node === null) return

		const result = {}

		const left = this.inorderTreeWalkPrint(node.left)
		const right = this.inorderTreeWalkPrint(node.right)

		if (left) result['left'] = left
		result['root'] = node.value
		if (right) result['right'] = right

		return result
	}

	// Зворотній обхід
	preorderTreeWalkPrint(node: TreeNode<T>) {
		if (node === null) return
		this.preorderTreeWalkPrint(node.left)
		this.preorderTreeWalkPrint(node.right)
		console.log(node.value)
	}

	// Прямий обхід
	postorderTreeWalkPrint(node: TreeNode<T>) {
		if (node === null) return
		console.log(node.value)
		this.postorderTreeWalkPrint(node.left)
		this.postorderTreeWalkPrint(node.right)
	}

	updateHeight(node: TreeNode<T>) {
		node.height =
			Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1
	}

	getHeight(node: TreeNode<T>) {
		return node === null ? -1 : node.height
	}

	getBalance(node: TreeNode<T>) {
		return node === null
			? 0
			: this.getHeight(node.right) - this.getHeight(node.left)
	}

	swap(a: TreeNode<T>, b: TreeNode<T>) {
		const a_key = a.key
		a.key = b.key
		b.key = a_key

		const a_value = a.value
		a.value = b.value
		b.value = a_value
	}

	rightRotate(node: TreeNode<T>) {
		this.swap(node, node.left)
		const buffer = node.right
		node.right = node.left
		node.left = node.right.left
		node.right.left = node.right.right
		node.right.right = buffer

		this.updateHeight(node.right)
		this.updateHeight(node)
	}

	leftRotate(node: TreeNode<T>) {
		this.swap(node, node.right)
		const buffer = node.left

		node.left = node.right
		node.right = node.left.right
		node.left.right = node.left.left
		node.left.left = buffer

		this.updateHeight(node.left)
		this.updateHeight(node)
	}

	balance(node: TreeNode<T>) {
		const balance = this.getBalance(node)
		if (balance === -2) {
			if (this.getBalance(node.left) === 1) this.leftRotate(node.left)
			this.rightRotate(node)
		} else if (balance === 2) {
			if (this.getBalance(node.right) === -1) this.rightRotate(node.right)
			this.leftRotate(node)
		}
	}
}

class AVLTree<T> {
	headNode: TreeNode<T> | null = null

	insert(key: number, value: T) {
		if (this.headNode === null) {
			this.headNode = new TreeNode<T>(key, value)
			return
		}

		this.headNode.insert(this.headNode, key, value)
	}

	search(key: number) {
		return this.headNode.search(this.headNode, key)?.value
	}

	delete(key: number) {
		return this.headNode.delete(this.headNode, key)
	}

	showStructure(type: 'inorder' | 'preorder' | 'postorder' = 'inorder') {
		if (type === 'inorder')
			return this.headNode.inorderTreeWalkPrint(this.headNode)
		if (type === 'preorder')
			return this.headNode.preorderTreeWalkPrint(this.headNode)
		if (type === 'postorder')
			return this.headNode.postorderTreeWalkPrint(this.headNode)
	}

	treeForOutput() {
		return this.headNode.treeForOutput(this.headNode)
	}
}

export default AVLTree
