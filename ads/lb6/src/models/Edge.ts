import { Node } from './Node'

class Edge {
	adjacentNode: Node
	weight: number
	status: 'standart' | 'no-direction' = 'standart'
	type: 'default' | 'forward' | 'cross' | 'back' = 'default'

	constructor(
		adjacentNode: Node,
		weight: number,
		status: 'standart' | 'no-direction' = 'standart'
	) {
		this.adjacentNode = adjacentNode
		this.weight = weight
		this.status = status
	}
}

export { Edge }
