class TreeNode {
	letter: string | null
	weight: number
	right: TreeNode
	left: TreeNode

	constructor(letter: string | null, weight: number) {
		this.letter = letter
		this.weight = weight
	}
}

class EncodeAndDecode {
	encodeFromFileToFiles(textForEncode: string) {
		const fileText = textForEncode

		return this.encode(fileText)
	}

	decodeFromFilesToFile(textForEncode: string, treeJson: string) {
		const treeRoot = this.treeFromObject(JSON.parse(treeJson))

		const decoded = this.decode(textForEncode, treeRoot)

		return decoded
	}

	encode(text: string) {
		const lettersCount = this.lettersCountInText(text)

		const list = [...lettersCount.entries()].map(([letter, weight]) => {
			return new TreeNode(letter, weight)
		})

		const huffmanBinaryTreeRoot = this.huffman(list)

		const codes = {}
		this.printCodesFromBinaryTree(huffmanBinaryTreeRoot, codes)

		const resultArray = Array.from(text).map(char => codes[char])

		const treeOutput = this.treeToJson(huffmanBinaryTreeRoot)

		return {
			tree: treeOutput,
			string: resultArray.join('')
		}
	}

	decode(encodedText: string, tree: TreeNode) {
		const result = []

		let node = tree
		for (let i = 0; i <= encodedText.length; i++) {
			node = encodedText.charAt(i) == '0' ? node.left : node.right

			if (node.letter !== null) {
				result.push(node.letter)
				node = tree
			}
		}

		return result.join('')
	}

	// eslint-disable-next-line
	private treeFromObject(object: any) {
		const node = new TreeNode(object.letter, 0)

		if (object.letter === null) {
			node.right = this.treeFromObject(object.right)
			node.left = this.treeFromObject(object.left)
		}

		return node
	}

	private treeToJson(node: TreeNode) {
		const result = {
			letter: node.letter
		}

		if (node.letter === null) {
			result['left'] = this.treeToJson(node.left)
			result['right'] = this.treeToJson(node.right)
		}

		return result
	}

	private printCodesFromBinaryTree(
		node: TreeNode,
		result: Record<string, string>,
		c = ''
	) {
		if (node.letter !== null) {
			result[node.letter] = c
			return
		}

		this.printCodesFromBinaryTree(node.right, result, c + '1')
		this.printCodesFromBinaryTree(node.left, result, c + '0')
	}

	private huffman(list: TreeNode[]) {
		while (list.length > 1) {
			list.sort((a, b) => {
				return b.weight - a.weight
			})

			const right = list.pop()
			const left = list.pop()

			const newTreeNode = new TreeNode(null, left.weight + right.weight)
			newTreeNode.left = left
			newTreeNode.right = right

			list.push(newTreeNode)
		}

		return list[0]
	}

	private lettersCountInText(text: string): Map<string, number> {
		const lettersCount = new Map<string, number>()

		for (const letter of text) {
			lettersCount.set(letter, (lettersCount.get(letter) ?? 0) + 1)
		}

		return lettersCount
	}
}

export { EncodeAndDecode }
