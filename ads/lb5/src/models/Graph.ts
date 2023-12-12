import { Edge } from './Edge'
import { Node } from './Node'

export type GraphValue = string

export class Graph {
	graph = new Map<GraphValue, Node>()
	mode: 'directed' | 'undirected' = 'directed'
	weights: boolean = false

	addOrGetNode(
		graph: Map<GraphValue, Node>,
		value: GraphValue,
		x?: number,
		y?: number
	) {
		if (value.length === 0) return null
		if (graph.has(value)) return graph.get(value) as Node

		const node: Node = new Node(value, x, y)
		graph.set(value, node)

		return node
	}

	toggleEdge(fromNode: Node, toNode: Node, weight: number = 1) {
		const findedEdgeFromTo = [...fromNode.edges].find(edge => {
			return edge.adjacentNode === toNode
		})

		const findedEdgeToFrom = [...toNode.edges].find(edge => {
			return edge.adjacentNode === fromNode
		})

		if (findedEdgeFromTo) {
			if (findedEdgeFromTo.status === 'no-direction') {
				findedEdgeFromTo.status = 'standart'
				return
			}

			fromNode.edges.delete(findedEdgeFromTo)

			if (findedEdgeToFrom) {
				if (this.mode === 'directed') {
					if (findedEdgeToFrom.status === 'no-direction') {
						toNode.edges.delete(findedEdgeToFrom)
					}

					if (findedEdgeToFrom.status === 'standart') {
						fromNode.edges.add(new Edge(toNode, 1, 'no-direction'))
					}
				}

				if (this.mode === 'undirected') {
					toNode.edges.delete(findedEdgeToFrom)
				}
			}
		} else {
			fromNode.edges.add(new Edge(toNode, weight, 'standart'))

			if (!findedEdgeToFrom) {
				if (this.mode === 'directed') {
					toNode.edges.add(new Edge(fromNode, weight, 'no-direction'))
				}

				if (this.mode === 'undirected') {
					toNode.edges.add(new Edge(fromNode, weight, 'standart'))
				}
			}
		}
	}

	createGraph(
		graphData: {
			from: GraphValue
			to: GraphValue
			weight: number
			x: number
			y: number
		}[]
	) {
		const newGraph = new Map<GraphValue, Node>()

		for (const row of graphData) {
			const node = this.addOrGetNode(newGraph, row.from)
			if (!node) continue

			node.x = row.x
			node.y = row.y

			const adjuacentNode = this.addOrGetNode(newGraph, row.to)

			if (adjuacentNode === null) continue

			this.toggleEdge(node, adjuacentNode, row.weight)
			// const edge = new Edge(adjuacentNode, row.weight)

			// node?.edges.add(edge)
		}

		return newGraph
	}
}
