export type LogTreeNode = {
	name: string
	children?: Array<LogTreeNode>
}

function logTree(
	tree: LogTreeNode | LogTreeNode[],
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

export { logTree }
