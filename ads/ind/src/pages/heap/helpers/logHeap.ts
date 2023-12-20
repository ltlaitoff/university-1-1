type TreeNode<T = string> = {
	name: T
	children?: Array<TreeNode>
}

function logTree(
	tree: TreeNode<string> | TreeNode<string>[],
	level = 0,
	parentPre = '',
	treeStr = ''
) {
	if (!Array.isArray(tree)) {
		const children = tree['children']

		treeStr = `${tree['name']}\n`

		if (children) {
			treeStr += logTree(children, level + 1)
		}

		return treeStr
	}

	tree.forEach((child, index) => {
		const hasNext = tree[index + 1] ? true : false
		const children = child['children']

		treeStr += `${parentPre}${hasNext ? '├' : '└'}── ${child['name']}\n`

		if (children) {
			treeStr += logTree(
				children,
				level + 1,
				`${parentPre}${hasNext ? '│' : ' '}   `
			)
		}
	})

	return treeStr
}

function heapToTree<T>(
	heap: T[],
	toString: (value: T) => string,
	index: number = 0
): TreeNode<string> | null {
	if (index >= heap.length) return null

	const left = heapToTree(heap, toString, index * 2 + 1)
	const right = heapToTree(heap, toString, index * 2 + 2)

	return {
		name: toString(heap[index]),
		children: [left, right].filter(item => item !== null) as TreeNode<string>[]
	}
}

function logHeap<T>(heap: T[], toString: (value: T) => string) {
	return logTree(heapToTree(heap, toString) as TreeNode)
}

export { logHeap }
