import './style.css'
import { Graph, GraphValue } from './models/Graph.ts'
import { Edge } from './models/Edge.ts'
import { Node } from './models/Node.ts'
import { NODE_COLORS } from './config/nodeColors.ts'
import { DELAY } from './config/delay.ts'
import words from './data/words.ts'

async function sleep(time: number) {
	await new Promise(resolve => {
		setTimeout(() => {
			resolve(null)
		}, time)
	})
}

class TreeNode {
	value: GraphValue
	childrens: TreeNode[] = []

	constructor(value: GraphValue) {
		this.value = value
	}

	find(node: TreeNode, value: GraphValue): TreeNode | undefined {
		if (node.value === value) return node

		for (const child of node.childrens) {
			const result = this.find(child, value)

			if (result) {
				return result
			}
		}

		return undefined
	}

	add(node: TreeNode) {
		this.childrens.push(node)
	}
}

class Tree {
	root: TreeNode

	constructor(value: GraphValue) {
		this.root = new TreeNode(value)
	}

	add(node: GraphValue, value: GraphValue) {
		const prevNode = this.root.find(this.root, node)

		if (!prevNode) return

		prevNode.add(new TreeNode(value))
	}

	display() {
		console.log(this.root)
	}
}

const DEBUG = false

class App {
	graph: Graph

	offsetX = 0
	offsetY = -105
	lastGraph: 'default' | 'lb5' | 'lb61' | 'lb62' = 'default'

	mouseDownValues: {
		active: boolean
		target: HTMLElement | null
		innerOffsetX: number
		innerOffsetY: number
	} = {
		active: false,
		target: null,
		innerOffsetX: 0,
		innerOffsetY: 0
	}

	algorithmActiveId: number | null = -1
	currentClickedTarget: HTMLElement | null = null

	pressedKeyCode: string | null = null

	constructor() {
		this.graph = new Graph()
		// this.initializeGraph()
		this.initializeGraphForLB61()
		this.render()
	}

	onKeyDown(event: KeyboardEvent): void {
		this.pressedKeyCode = event.code

		if (event.code === 'Escape') {
			this.currentClickedTarget = null
			this.render()
		}
	}

	onKeyUp(event: KeyboardEvent): void {
		if (this.pressedKeyCode === event.code) {
			this.pressedKeyCode = null
			this.render()
		}
	}

	onMouseDown(e: MouseEvent) {
		this.mouseDownValues = {
			active: true,
			target: e.target as HTMLElement,
			innerOffsetX:
				e.clientX - (e.target as HTMLElement).getBoundingClientRect().x - 20,
			innerOffsetY:
				e.clientY - (e.target as HTMLElement).getBoundingClientRect().y - 20
		}
	}

	onMouseUp() {
		this.mouseDownValues = {
			active: false,
			target: null,
			innerOffsetX: 0,
			innerOffsetY: 0
		}
	}

	onMouseMove(e: MouseEvent) {
		if (!this.mouseDownValues.active) return

		if (this.pressedKeyCode === 'Space') {
			console.log(e)
			this.offsetX += e.movementX
			this.offsetY += e.movementY

			this.render()
		} else {
			if (!this.mouseDownValues.target) return
			if (!this.mouseDownValues.target.dataset.elementid) return
			const node = this.graph.graph.get(
				this.mouseDownValues.target.dataset.elementid
			)

			if (!node) return

			node.x = e.clientX - this.offsetX - this.mouseDownValues.innerOffsetX
			node.y = e.clientY - this.offsetY - this.mouseDownValues.innerOffsetY

			this.render()

			console.log(this.mouseDownValues.target.dataset.elementid)
		}
	}

	onClick(e: MouseEvent) {
		console.log('click')

		if ((e.target as HTMLElement).tagName !== 'svg') {
			if (!(e.target as HTMLElement).dataset.elementid) return

			console.log('currentClikedTarget: ', this.currentClickedTarget)

			if (
				this.currentClickedTarget !== null &&
				this.currentClickedTarget !== e.target
			) {
				const nodePrev = this.graph.graph.get(
					this.currentClickedTarget.dataset.elementid || ''
				)

				const nodeCurrent = this.graph.graph.get(
					(e.target as HTMLElement).dataset.elementid || ''
				)

				if (!nodePrev || !nodeCurrent) return

				this.graph.toggleEdge(nodePrev, nodeCurrent)

				// const findedEdge = [...nodePrev.edges].find(edge => {
				// 	return edge.adjacentNode === nodeCurrent
				// })

				// if (!findedEdge) {
				// 	nodePrev.edges.add(new Edge(nodeCurrent, 1))
				// } else {
				// 	nodePrev.edges.delete(findedEdge)
				// }

				this.currentClickedTarget = null

				this.render()
				return
			}

			this.currentClickedTarget = e.target as HTMLElement

			this.render()
			return
		}

		console.log(e)
		console.log({
			x: e.x,
			y: e.y,
			offsetX: this.offsetX,
			offsetY: this.offsetY
		})

		const lastElement = [...this.graph.graph.values()].reduce((acc, node) => {
			const asNumber = Number(node.value)

			if (isNaN(asNumber)) {
				return acc
			}

			return asNumber > acc ? asNumber : acc
		}, -1)

		this.graph.addOrGetNode(
			this.graph.graph,
			String(lastElement + 1),
			e.clientX - this.offsetX,
			e.clientY - this.offsetY
		)

		this.render()
	}

	onContextMenu(e: MouseEvent) {
		e.preventDefault()

		if (!(e.target as HTMLElement).dataset.elementid) return

		const nodeId = (e.target as HTMLElement).dataset.elementid || ''

		const node = this.graph.graph.get(nodeId)

		if (!node) return

		this.graph.graph.forEach(graphNode => {
			graphNode.edges = new Set(
				[...graphNode.edges].filter(edge => {
					return edge.adjacentNode !== node
				})
			)
		})

		this.graph.graph.delete(nodeId)

		this.render()
	}

	// #nodeStatusChanger(node: Node, newStatus: 'default' | 'progress' | 'done') {
	// 	node.status = newStatus
	// }

	#graphNodesStatusResetter(id: number) {
		if (this.algorithmActiveId !== id) return

		this.graph.graph.forEach(node => {
			if (this.algorithmActiveId !== id) return

			node.status = 'default'
		})

		this.render()
	}

	#graphEdgesTypeResetter(id: number) {
		if (this.algorithmActiveId !== id) return

		this.graph.graph.forEach(node => {
			if (this.algorithmActiveId !== id) return

			node.edges.forEach(edge => {
				edge.type = 'default'
			})
		})

		this.render()
	}

	async #setNodeStatus(
		node: Node,
		params: {
			status?: Node['status']
			sleep?: boolean
			render?: boolean
			statusForChange?: Node['status'] | 'any'
			renderBeforeSleep?: boolean
		} = {}
	) {
		const status = params.status ?? 'default'
		const sleepFlag = params.sleep ?? true
		const render = params.render ?? true
		const statusForChange = params.statusForChange ?? node.status
		const renderBeforeSleep = params.renderBeforeSleep ?? false

		if (statusForChange && statusForChange === node.status) {
			node.status = status
		}

		if (render && renderBeforeSleep) {
			this.render()
		}

		if (sleepFlag) {
			await sleep(DELAY)
		}

		if (render && !renderBeforeSleep) {
			this.render()
		}
	}

	/* Algorithms */

	// TODO: Move to another class
	async dfsWrapper(id: number) {
		const visited: Node[] = []

		for (const item of this.graph.graph.values()) {
			if (!visited.includes(item)) {
				if (this.algorithmActiveId !== id) {
					return
				}

				await this.dfs(item, visited, id)
			}
		}

		this.render()
	}

	async dfs(node: Node, visited: Node[], id: number) {
		const jungle: Node[] = []
		const stack = [node]

		while (stack.length > 0) {
			if (this.algorithmActiveId !== id) {
				return
			}

			const item = stack.pop()
			if (!item) return null

			visited.push(item)
			jungle.push(item)
			;[...item.edges].toReversed().forEach(edge => {
				if (this.graph.mode === 'directed' && edge.status === 'no-direction') {
					return
				}

				const adjacentNode = edge.adjacentNode

				if (!visited.includes(adjacentNode) && !stack.includes(adjacentNode)) {
					stack.push(adjacentNode)
				}
			})

			await this.#setNodeStatus(item, {
				status: 'progress',
				sleep: false
			})
			await sleep(DELAY)
		}

		this.render()

		console.log('DFS:', jungle.map(item => item.value).join(', 	'))
	}

	// TODO: Move to another class
	async bfsWrapper(id: number) {
		const visited: Node[] = []

		for (const item of this.graph.graph.values()) {
			if (!visited.includes(item)) {
				if (this.algorithmActiveId !== id) {
					return
				}

				await this.bfs(item, visited, id)
			}
		}

		this.render()
	}

	async bfs(node: Node, visited: Node[], id: number) {
		const tree = new Tree(node.value)

		const queue = [node]

		while (queue.length > 0) {
			if (this.algorithmActiveId !== id) {
				return
			}

			const item = queue.shift()
			if (!item) return null

			visited.push(item)

			item.edges.forEach(edge => {
				if (this.graph.mode === 'directed' && edge.status === 'no-direction')
					return

				const adjacentNode = edge.adjacentNode

				if (!visited.includes(adjacentNode) && !queue.includes(adjacentNode)) {
					tree.add(item.value ?? -1, adjacentNode.value ?? -1)
					queue.push(adjacentNode)
				}
			})

			await this.#setNodeStatus(item, {
				status: 'progress',
				sleep: false
			})
			await sleep(DELAY)
		}

		tree.display()

		this.render()
	}

	async lb5TaskOne(
		node: Node,
		visited: Node[],
		id: number,
		maxLevel = 2,
		level = 0
	) {
		if (level > maxLevel) return []

		visited.push(node)

		node.status = 'progress'

		this.render()

		await sleep(DELAY)

		const result: (number | null)[] = []

		for (const edge of node.edges) {
			if (this.graph.mode === 'directed' && edge.status === 'no-direction') {
				continue
			}

			if (!visited.includes(edge.adjacentNode)) {
				if (this.algorithmActiveId !== id) {
					return
				}

				const r = await this.lb5TaskOne(
					edge.adjacentNode,
					visited,
					id,
					maxLevel,
					level + 1
				)

				if (r === undefined) {
					continue
				}

				result.push(r)
			}
		}

		return [node.value, ...result].flat()
	}

	async lb5TaskSecond(id: number) {
		const visited: Node[] = []
		const startTime: Map<Node, number> = new Map()
		const endTime: Map<Node, number> = new Map()
		const state: { time: number } = { time: 0 }

		for (const item of this.graph.graph.values()) {
			if (!visited.includes(item)) {
				if (this.algorithmActiveId !== id) {
					return
				}

				await this.lb5TaskSecondInner(
					item,
					visited,
					startTime,
					endTime,
					state,
					id
				)
			}
		}

		console.log(startTime.size, endTime.size)

		this.render()
	}

	compareStrings(firstString: string, secondString: string) {
		if (firstString === secondString) return true
		if (firstString.length !== secondString.length) return false

		let differences = 0

		for (let i = 0; i < firstString.length; i++) {
			if (firstString[i] !== secondString[i]) {
				differences++

				if (differences > 1) return false
			}
		}

		return true
	}

	async findPathThird(
		start: Node,
		end: Node,
		visited: Set<Node>,
		path: Map<Node, Node>
	) {
		const queue = [start]

		while (queue.length > 0) {
			const item = queue.shift()
			if (!item) return null

			if (item === end) {
				return item
			}

			visited.add(item)

			item.edges.forEach(edge => {
				if (this.graph.mode === 'directed' && edge.status === 'no-direction')
					return

				const adjacentNode = edge.adjacentNode

				if (!visited.has(adjacentNode) && !queue.includes(adjacentNode)) {
					queue.push(adjacentNode)
					path.set(adjacentNode, item)
				}
			})
		}

		return false

		// if (start === end) {
		// 	paths.push([...visited, start])

		// 	console.log(paths.at(-1))
		// 	return
		// }

		// // if (visited.size > 50) {
		// // 	return
		// // }

		// visited.add(start)

		// for (const edge of start.edges) {
		// 	if (!visited.has(edge.adjacentNode)) {
		// 		this.findPathThird(edge.adjacentNode, end, visited, paths)
		// 	}
		// }

		// visited.delete(start)
	}

	async lb5TaskThird(wordFrom: string = 'abba', wordTo: string = 'alba') {
		if (wordFrom.length !== wordTo.length) return false

		const wordsWithLenght: string[] = words.filter(
			word => word.length === wordFrom.length
		)

		if (wordsWithLenght.includes(wordFrom) === false) return false
		if (wordsWithLenght.includes(wordTo) === false) return false

		this.lastGraph = 'lb5'
		this.graph.graph = new Map()

		const newGraph = this.graph

		let x = 0
		let y = 0
		const maxRow = 30
		let row = 0

		wordsWithLenght.forEach(element => {
			newGraph.addOrGetNode(newGraph.graph, element, x, y)
			x += 100

			if (row >= maxRow) {
				y += 100
				x = 0
				row = 0
			}

			row++
		})

		this.render()

		console.time('Start creating of graph')
		let passed = 0

		newGraph.graph.forEach(rootNode => {
			newGraph.graph.forEach(node => {
				if (rootNode === node) return

				const findedEdge = [...rootNode.edges].find(edge => {
					return edge.adjacentNode === node
				})
				if (findedEdge !== undefined) return

				if (this.compareStrings(rootNode.value, node.value)) {
					newGraph.toggleEdge(rootNode, node)
				}
			})

			passed++

			console.log(
				`${((passed / wordsWithLenght.length) * 100).toFixed(2)}% passed`
			)
		})

		console.timeEnd('Start creating of graph')

		this.render()

		// await sleep(5000)

		const startNode = [...newGraph.graph.values()].find(
			node => node.value === wordFrom
		)
		const endNode = [...newGraph.graph.values()].find(
			node => node.value === wordTo
		)
		if (!startNode || !endNode) return

		console.log('%c⧭', 'color: #733d00', startNode)
		console.log('%c⧭', 'color: #00bf00', endNode)

		const path = new Map()

		const resultNode = await this.findPathThird(
			startNode,
			endNode,
			new Set(),
			path
		)

		console.log(resultNode, path)

		let node = resultNode
		const path2: Node[] = []

		while (node !== startNode) {
			console.log(node)

			if (node == undefined || typeof node === 'boolean') {
				break
			}

			path2.unshift(node)
			node = path.get(node)
		}

		console.log(path2)

		await sleep(3000)

		path2.forEach(item => {
			item.status = 'progress'
		})

		startNode.status = 'done'
		endNode.status = 'done'

		// this.graph.graph = new Map()

		path2.unshift(startNode)

		for (let i = 0; i < path2.length; i++) {
			const element = path2[i]
			// this.graph.graph.set(element.value, element)

			const nextElement = path2[i + 1]

			element.edges.clear()
			if (nextElement) {
				element.edges.add(new Edge(nextElement, 1))
			}
		}

		this.graph.graph.forEach((item, key) => {
			if (!path2.includes(item) && item !== startNode && item !== endNode) {
				this.graph.graph.delete(key)
			}
		})

		this.render()
	}

	async lb5TaskSecondInner(
		node: Node,
		visited: Node[],
		startTime: Map<Node, number>,
		endTime: Map<Node, number>,
		state: { time: number },
		id: number
	) {
		const jungle: Node[] = []

		if (this.algorithmActiveId !== id) {
			return
		}

		if (!node) return null

		startTime.set(node, state.time)
		state.time++

		visited.push(node)
		jungle.push(node)

		for (const edge of [...node.edges].toReversed()) {
			if (this.graph.mode === 'directed' && edge.status === 'no-direction') {
				continue
			}

			const adjacentNode = edge.adjacentNode

			// if (item.value === 8) debugger

			if (!visited.includes(adjacentNode)) {
				console.log(
					'Tree Edge: ' + node.value + '-->' + adjacentNode.value + '<br>'
				)

				edge.type = 'default'

				await this.lb5TaskSecondInner(
					adjacentNode,
					visited,
					startTime,
					endTime,
					state,
					id
				)
			} else {
				// if parent node is traversed after the neighbour node

				const itemStartTime = startTime.get(node) ?? -1
				const adjacentStartTime = startTime.get(adjacentNode) ?? -1
				const itemEndTime = endTime.get(node) ?? -1
				const adjacentEndTime = endTime.get(adjacentNode) ?? -1

				console.table({
					value: node.value,
					// startTime: startTime,
					// endTime: JSendTime,
					adjacentNode: adjacentNode.value,
					itemStartTime: itemStartTime,
					adjacentStartTime: adjacentStartTime,
					itemEndTime: itemEndTime,
					adjacentEndTime: adjacentEndTime
				})

				if (itemStartTime >= adjacentStartTime && adjacentEndTime === -1) {
					console.log(
						'Back Edge: ' + node.value + '-->' + adjacentNode.value + '<br>'
					)
					edge.type = 'back'
				}

				// if the neighbour node is a  but not a part of the tree
				else if (itemStartTime < adjacentStartTime && adjacentEndTime !== -1) {
					console.log(
						'Forward Edge: ' + node.value + '-->' + adjacentNode.value + '<br>'
					)
					edge.type = 'forward'
				}

				// if parent and neighbour node do not
				// have any ancestor and descendant relationship between them
				else {
					console.log(
						'Cross Edge: ' + node.value + '-->' + adjacentNode.value + '<br>'
					)
					edge.type = 'cross'
				}
			}
		}

		endTime.set(node, state.time)
		state.time++

		await this.#setNodeStatus(node, {
			status: 'progress',
			sleep: false
		})

		await sleep(DELAY)

		this.render()

		// console.log('DFS:', jungle.map(item => item.value).join(', 	'))
	}

	/* LB 6 ADS 1 */
	async initHashTables(
		start: Node,
		unprocessedNodes: Set<Node>,
		timeToNodes: Map<Node, number>
	) {
		for (const node of this.graph.graph.values()) {
			unprocessedNodes.add(node)
			timeToNodes.set(node, Infinity)
		}

		timeToNodes.set(start, 0)
	}

	async getNodeWithMinTime(
		unprocessedNodes: Set<Node>,
		timeToNodes: Map<Node, number>
	) {
		let nodeWithMinTime: Node | null = null

		let minTime = Infinity

		for (const node of unprocessedNodes) {
			const time = timeToNodes.get(node)

			if (time !== undefined && time < minTime) {
				minTime = time
				nodeWithMinTime = node
			}
		}

		return nodeWithMinTime
	}

	async calculateTimeToEachNode(
		unprocessedNodes: Set<Node>,
		timeToNodes: Map<Node, number>
	) {
		while (unprocessedNodes.size > 0) {
			const node = await this.getNodeWithMinTime(unprocessedNodes, timeToNodes)

			if (!node) return
			if (timeToNodes.get(node) === Infinity) return

			await this.#setNodeStatus(node, {
				status: 'progress',
				statusForChange: 'default'
			})

			for (const edge of node.edges) {
				if (this.graph.mode === 'directed' && edge.status === 'no-direction') {
					continue
				}

				const adjacentNode = edge.adjacentNode

				if (unprocessedNodes.has(adjacentNode)) {
					const nodeTime = timeToNodes.get(node)
					if (nodeTime === undefined) continue

					const adjacentNodeTime = timeToNodes.get(adjacentNode)
					if (adjacentNodeTime === undefined) continue

					const timeToCheck = nodeTime + edge.weight

					if (timeToCheck < adjacentNodeTime) {
						timeToNodes.set(adjacentNode, timeToCheck)
					}
				}
			}

			unprocessedNodes.delete(node)
		}
	}

	async getShortestPath(
		start: Node,
		end: Node,
		timeToNodes: Map<Node, number>
	) {
		const path = []
		let node = end

		while (node !== start) {
			const minTimeToNode = timeToNodes.get(node)
			path.unshift(node)

			for (const [parent, parentEdge] of node.parents.entries()) {
				if (timeToNodes.has(parent) === undefined) continue

				const previousNodeFound =
					Number(parentEdge.weight + (timeToNodes.get(parent) ?? 0)) ===
					minTimeToNode

				if (previousNodeFound) {
					timeToNodes.delete(node)
					node = parent
					break
				}
			}
		}

		path.unshift(node)
		return path
	}

	async dijkstra(start: Node, end: Node) {
		const unprocessedNodes = new Set<Node>()
		const timeToNodes = new Map<Node, number>()

		await this.initHashTables(start, unprocessedNodes, timeToNodes)
		await this.calculateTimeToEachNode(unprocessedNodes, timeToNodes)

		if (timeToNodes.get(end) === Infinity) return null
		return await this.getShortestPath(start, end, timeToNodes)
	}

	/* LB 6 2*/

	async bellmanFord(startNode: Node) {
		const distances = new Map<Node, number>()

		for (const node of this.graph.graph.values()) {
			distances.set(node, Infinity)
		}

		distances.set(startNode, 0)

		for (let i = 0; i < this.graph.graph.size; i++) {
			for (const currentNode of [...this.graph.graph.values()]) {
				if (currentNode === startNode) {
					continue
				}

				for (const edge of currentNode.edges) {
					if (
						this.graph.mode === 'directed' &&
						edge.status === 'no-direction'
					) {
						continue
					}

					const newDistance = distances.get(currentNode)! + edge.weight

					if (newDistance < distances.get(edge.adjacentNode)!) {
						distances.set(edge.adjacentNode, newDistance)
					}
				}
			}
		}

		for (const currentNode of this.graph.graph.values()) {
			if (currentNode === startNode) {
				continue
			}

			for (const edge of currentNode.edges) {
				if (this.graph.mode === 'directed' && edge.status === 'no-direction') {
					continue
				}

				if (
					distances.get(currentNode)! + edge.weight <
					distances.get(edge.adjacentNode)!
				) {
					console.error('Graph contains a negative cycle.')
					return
				}
			}
		}

		return distances
	}

	floydWarshall(nodes: Node[]) {
		const numNodes = nodes.length

		const distances = Array.from({ length: numNodes }, () =>
			Array(numNodes).fill(Infinity)
		)

		nodes.forEach((node, i) => {
			distances[i][i] = 0

			node.edges.forEach(edge => {
				if (this.graph.mode === 'directed' && edge.status === 'no-direction') {
					return
				}

				const j = nodes.indexOf(edge.adjacentNode)

				distances[i][j] = edge.weight
			})
		})

		for (let i = 0; i < numNodes; i++) {
			for (let j = 0; j < numNodes; j++) {
				for (let k = 0; k < numNodes; k++) {
					if (distances[j][i] + distances[i][k] < distances[j][k]) {
						distances[j][k] = distances[j][i] + distances[i][k]
					}
				}
			}
		}

		nodes.forEach((nodeTop, i) => {
			nodes.forEach((nodeBottom, j) => {
				const result = distances[i][j]

				if (result === Infinity) return

				console.log(`${nodeTop.value} => ${nodeBottom.value}: ${result}`)
			})
		})

		return distances
	}

	async findPath(
		start: Node,
		end: Node,
		visited: Node[],
		path: Node[],
		id: number
	) {
		if (start === end) {
			path.push(start)

			await this.#setNodeStatus(start, {
				status: 'done',
				sleep: false
			})

			return true
		}

		visited.push(start)

		await this.#setNodeStatus(start, {
			status: 'progress'
		})

		for (const edge of start.edges) {
			if (this.algorithmActiveId !== id) {
				return
			}

			if (!visited.includes(edge.adjacentNode)) {
				if (await this.findPath(edge.adjacentNode, end, visited, path, id)) {
					if (this.algorithmActiveId !== id) {
						return
					}

					path.push(start)

					await this.#setNodeStatus(start, {
						status: 'done',
						sleep: false
					})

					return true
				}
			}
		}

		if (start.status === 'progress') {
			start.status = 'passed'
		}

		this.render()
	}

	async findPathes(
		start: Node,
		end: Node,
		visited: Set<Node>,
		paths: Node[][],
		id: number
	) {
		if (start === end) {
			paths.push([...visited, start])

			paths[paths.length - 1].forEach(item => {
				item.status = 'done'
			})

			return
		}

		visited.add(start)

		await this.#setNodeStatus(start, {
			status: 'progress'
		})

		// if (start.status === 'default') {
		// 	start.status = 'progress'
		// }

		// await sleep(DELAY)

		// this.render()

		for (const edge of start.edges) {
			if (this.algorithmActiveId !== id) {
				return
			}

			if (!visited.has(edge.adjacentNode)) {
				await this.findPathes(edge.adjacentNode, end, visited, paths, id)
			}
		}

		visited.delete(start)

		await this.#setNodeStatus(start, {
			status: 'passed',
			sleep: false,
			statusForChange: 'progress'
		})

		// if (start.status === 'progress') {
		// 	start.status = 'passed'
		// }
		// this.render()
	}

	private initializeGraph() {
		this.graph.graph = this.graph.createGraph([
			{ from: '1', to: '9', weight: 1, x: 751, y: 189 },
			{ from: '1', to: '2', weight: 1, x: 751, y: 189 },
			{ from: '1', to: '3', weight: 1, x: 751, y: 189 },
			{ from: '1', to: '4', weight: 1, x: 751, y: 189 },
			{ from: '2', to: '5', weight: 1, x: 516, y: 335 },
			{ from: '2', to: '6', weight: 1, x: 516, y: 335 },
			{
				from: '3',
				to: '7',
				weight: 1,
				x: 691,
				y: 372
			},
			{
				from: '3',
				to: '8',
				weight: 1,
				x: 691,
				y: 372
			},
			{ from: '4', to: '9', weight: 1, x: 1020, y: 336 },
			{ from: '4', to: '10', weight: 1, x: 1020, y: 336 },
			{ from: '5', to: '', weight: 1, x: 390, y: 508 },
			{
				from: '6',
				to: '11',
				weight: 1,
				x: 564,
				y: 511
			},
			{ from: '7', to: '11', weight: 1, x: 681, y: 502 },
			{ from: '8', to: '1', weight: 1, x: 855, y: 494 },
			{ from: '9', to: '12', weight: 1, x: 961, y: 492 },
			{ from: '10', to: '', weight: 1, x: 1136, y: 484 },
			{
				from: '11',
				to: '13',
				weight: 1,
				x: 622,
				y: 657
			},
			{ from: '12', to: '', weight: 1, x: 1002, y: 646 },
			{ from: '13', to: '12', weight: 1, x: 813, y: 649 }
		])
	}

	#getNodeStatusForRender(node: Node) {
		return this.currentClickedTarget &&
			this.currentClickedTarget.dataset.elementid === node.value
			? 'checked'
			: node.status
	}

	#getRenderedCircles() {
		// console.log(JSON.stringify([...this.graph.graph.values()]))

		return [...this.graph.graph.entries()].map(
			(
				// eslint-disable-next-line
				[_, node]
			) => {
				const status = this.#getNodeStatusForRender(node)
				const x = (node.x ?? 0) + this.offsetX
				const y = (node.y ?? 0) + this.offsetY

				return `<g
						fixed="false"
						style="cursor: pointer;"
					>
						<circle
							class="content--circle"
							stroke-width="2"
							fill="${NODE_COLORS[status]}"
							stroke="black"
							r="19"
							data-elementId="${node.value}"
							cx="${x}"
							cy="${y}"
						></circle>
						<text
							class="content--text"
							font-size="14"
							dy=".35em"
							text-anchor="middle"
							stroke-width="1"
							fill="black"
							stroke="black"
							data-elementId="${node.value}"
							x="${x}"
							y="${y}"
							style="user-select: none"
						>
							${node.value}
						</text>
					</g>`
			}
		)
	}

	#getLinesForRender() {
		return (
			[...this.graph.graph.entries()]
				// eslint-disable-next-line
				.map(([_, node]) => {
					return [...node.edges].map(edge => {
						const adjacentNodeX = edge.adjacentNode.x ?? 0
						const adjacentNodeY = edge.adjacentNode.y ?? 0
						const nodeX = node.x ?? 0
						const nodeY = node.y ?? 0

						const vectorOne = [adjacentNodeX - nodeX, adjacentNodeY - nodeY]
						const vectorOneProtectionToX = [Math.abs(adjacentNodeX - nodeX), 0]

						const top =
							vectorOne[0] * vectorOneProtectionToX[0] +
							vectorOne[1] * vectorOneProtectionToX[1]
						const bottom =
							Math.sqrt(vectorOne[0] ** 2 + vectorOne[1] ** 2) *
							Math.sqrt(
								vectorOneProtectionToX[0] ** 2 + vectorOneProtectionToX[1] ** 2
							)

						const arrowRotateDeg = (Math.acos(top / bottom) * 180) / Math.PI
						const arrowRotateDegWithReflection =
							vectorOne[1] < 0 ? 360 - arrowRotateDeg : arrowRotateDeg

						const distanceFromCenter = [
							19 * Math.cos((arrowRotateDegWithReflection * Math.PI) / 180),
							19 * Math.sin((arrowRotateDegWithReflection * Math.PI) / 180)
						]

						if (
							edge.status === 'no-direction' &&
							this.graph.mode !== 'undirected'
						)
							return

						const color =
							edge.status === 'no-direction' && DEBUG
								? 'green'
								: edge.type === 'default'
								  ? 'black'
								  : edge.type === 'back'
								    ? 'lightblue'
								    : edge.type === 'cross'
								      ? 'lightgreen'
								      : 'lightpink'

						const arrow = `<path stroke="${color}" fill="${color}" d="M -15 5.5 L 0 0 L -15 -5.5 Z" transform="translate (${
							adjacentNodeX + this.offsetX - distanceFromCenter[0]
						} ${
							adjacentNodeY + this.offsetY - distanceFromCenter[1]
						}) rotate(${arrowRotateDegWithReflection})"></path>`

						const textPosition = {
							x:
								(nodeX + adjacentNodeX) / 2 +
								distanceFromCenter[0] +
								this.offsetX,
							y:
								(nodeY + adjacentNodeY) / 2 +
								distanceFromCenter[1] +
								this.offsetY
						}

						const text = `
							<text x="${textPosition.x}" y="${textPosition.y}" style="stroke:white; stroke-width:0.6em">${edge.weight}</text>
							<text x="${textPosition.x}" y="${textPosition.y}" style="fill:black">${edge.weight}</text> `

						return `<g>
							<path
							class="content--edge"
								d="M ${nodeX + this.offsetX} ${nodeY + this.offsetY} L ${
									adjacentNodeX + this.offsetX
								} ${adjacentNodeY + this.offsetY}"
								fill="none"
								stroke-width="2"
								stroke="${color}"
							></path>
							<path
							class="content--edge"
							d="M ${nodeX + this.offsetX} ${nodeY + this.offsetY} L ${
								adjacentNodeX + this.offsetX
							} ${adjacentNodeY + this.offsetY}"
								opacity="0" 
								fill="none"
								stroke-width="30"
								stroke="${color}"
							></path>
							${this.graph.mode === 'directed' || DEBUG ? arrow : ''}
							${this.graph.weights ? text : ''}
						</g>`
					})
				})
				.flat()
		)
	}

	render() {
		const ourNodes = this.#getRenderedCircles()
		const ourEdges = this.#getLinesForRender()

		document.querySelector<HTMLDivElement>('#content')!.innerHTML = `
			<div class="graph__wrapper">
				<svg
				width="100%"
				height="100%"
				preserveAspectRatio="none"
				cursor="${this.pressedKeyCode === 'Space' ? 'grabbing' : 'default'}"
				>
					<g>
						<g>
							${ourEdges.join(' ')}
						</g>
						<g>
							${ourNodes.join(' ')}
						</g>
					</g>
				</svg>
			</div>
		`
	}

	initializeApp() {
		this.#initilizeUserEvents()
		this.#initilizeMenu()
	}

	#initilizeUserEvents() {
		document.addEventListener('mousedown', (e: MouseEvent) =>
			this.onMouseDown(e)
		)
		document.addEventListener('mouseup', () => this.onMouseUp())
		document.addEventListener('mousemove', (e: MouseEvent) =>
			this.onMouseMove(e)
		)

		document.addEventListener('contextmenu', (e: MouseEvent) =>
			this.onContextMenu(e)
		)
		document.addEventListener('click', (e: MouseEvent) => this.onClick(e))

		document.addEventListener('keydown', (e: KeyboardEvent) =>
			this.onKeyDown(e)
		)
		document.addEventListener('keyup', (e: KeyboardEvent) => this.onKeyUp(e))
	}

	localState:
		| {
				opened: false
		  }
		| {
				opened: true
				algorithm: string
				activeElement: HTMLElement
		  } = {
		opened: false
	}

	initializeGraphForLB61() {
		this.graph.graph = this.graph.createGraph([
			{ from: '1', to: '6', weight: 22, x: 500, y: 500 },
			{ from: '1', to: '5', weight: 31, x: 500, y: 500 },
			{ from: '1', to: '4', weight: 31, x: 500, y: 500 },
			{ from: '1', to: '3', weight: 52, x: 500, y: 500 },
			{
				from: '2',
				to: '9',
				weight: 37,
				x: 494,
				y: 216
			},
			{
				from: '3',
				to: '2',
				weight: 52,
				x: 984,
				y: 336
			},
			{
				from: '3',
				to: '9',
				weight: 89,
				x: 984,
				y: 336
			},
			{
				from: '3',
				to: '4',
				weight: 52,
				x: 984,
				y: 336
			},
			{
				from: '4',
				to: '2',
				weight: 13,
				x: 668,
				y: 346
			},
			{
				from: '5',
				to: '6',
				weight: 65,
				x: 123,
				y: 333
			},
			{
				from: '5',
				to: '2',
				weight: 73,
				x: 123,
				y: 333
			},
			{
				from: '6',
				to: '4',
				weight: 68,
				x: 396,
				y: 338
			},
			{
				from: '6',
				to: '2',
				weight: 40,
				x: 396,
				y: 338
			},
			{ from: '7', to: '', weight: 18, x: 633, y: 6, status: 'default' },
			{
				from: '8',
				to: '',
				weight: 81,
				x: 888,
				y: 70
			},
			{
				from: '9',
				to: '',
				weight: 60,
				x: 800,
				y: 214
			}
		])
		this.render()
	}

	initializeGraphForLB62() {
		this.graph.graph = this.graph.createGraph([
			{ from: '1', to: '6', weight: 22, x: 500, y: 500 },
			{ from: '1', to: '5', weight: -31, x: 500, y: 500 },
			{ from: '1', to: '4', weight: -31, x: 500, y: 500 },
			{ from: '1', to: '3', weight: 52, x: 500, y: 500 },
			{
				from: '2',
				to: '9',
				weight: 37,
				x: 494,
				y: 216
			},
			{
				from: '3',
				to: '2',
				weight: -52,
				x: 984,
				y: 336
			},
			{
				from: '3',
				to: '9',
				weight: 89,
				x: 984,
				y: 336
			},
			{
				from: '3',
				to: '4',
				weight: -52,
				x: 984,
				y: 336
			},
			{
				from: '4',
				to: '2',
				weight: 13,
				x: 668,
				y: 346
			},
			{
				from: '5',
				to: '6',
				weight: -65,
				x: 123,
				y: 333
			},
			{
				from: '5',
				to: '2',
				weight: 73,
				x: 123,
				y: 333
			},
			{
				from: '6',
				to: '4',
				weight: 68,
				x: 396,
				y: 338
			},
			{
				from: '6',
				to: '2',
				weight: -40,
				x: 396,
				y: 338
			},
			{ from: '7', to: '', weight: 18, x: 633, y: 6, status: 'default' },
			{
				from: '8',
				to: '',
				weight: 81,
				x: 888,
				y: 70
			},
			{
				from: '9',
				to: '',
				weight: 60,
				x: 800,
				y: 214
			}
		])
		this.render()
	}

	#initilizeMenu() {
		const mainMenu = document.querySelector('#main-menu')
		const panel = document.querySelector('#panel')
		const form = document.querySelector('#form')
		const formHeading = document.querySelector('.panel__form-heading')
		const formCodeOutput = document.querySelector('#form-code-output')

		mainMenu?.addEventListener('click', async e => {
			if (!(e.target as HTMLElement).className.includes('menu__link')) return

			const targetDataId = (e.target as HTMLElement).dataset.id

			if (!targetDataId) {
				return
			}

			if (targetDataId === 'bfs' || targetDataId === 'dfs') {
				;(e.target as HTMLElement).classList.add('menu__link--active')

				const activeId = new Date().getTime()
				this.algorithmActiveId = new Date().getTime()

				this.#graphNodesStatusResetter(activeId)

				if (targetDataId === 'bfs') {
					await this.bfsWrapper(activeId)
				}

				if (targetDataId === 'dfs') {
					await this.dfsWrapper(activeId)
				}

				;(e.target as HTMLElement).classList.remove('menu__link--active')
				this.#graphNodesStatusResetter(activeId)

				return
			}

			if (targetDataId === 'reset') {
				this.algorithmActiveId = -1

				this.#graphNodesStatusResetter(this.algorithmActiveId)
				this.#graphEdgesTypeResetter(this.algorithmActiveId)
				return
			}

			if (targetDataId === 'mode') {
				if (this.graph.mode === 'directed') {
					this.graph.mode = 'undirected'
				} else {
					this.graph.mode = 'directed'
				}

				;(e.target as HTMLElement).textContent = this.graph.mode[0]
				this.render()
				return
			}

			if (targetDataId === 'change_graph') {
				if (this.lastGraph === 'default') {
					// lb61
					this.initializeGraphForLB61()
					;(e.target as HTMLElement).textContent = 'lb61'
					this.lastGraph = 'lb61'
					this.render()
					return
				}

				if (this.lastGraph === 'lb5') {
					this.initializeGraph()
					this.lastGraph = 'default'
					;(e.target as HTMLElement).textContent = 'd'
					this.render()
					return
				}

				if (this.lastGraph === 'lb61') {
					this.initializeGraphForLB62()
					this.lastGraph = 'lb62'
					;(e.target as HTMLElement).textContent = 'lb62'
					this.render()
					return
				}

				if (this.lastGraph === 'lb62') {
					this.initializeGraph()
					this.lastGraph = 'default'
					;(e.target as HTMLElement).textContent = 'd'
					this.render()
					return
				}

				return
			}

			if (targetDataId === 'weight') {
				if (this.graph.weights === true) {
					this.graph.weights = false
				} else {
					this.graph.weights = true
				}

				;(e.target as HTMLElement).textContent = this.graph.weights ? 'w' : 'nw'

				this.render()
				return
			}

			if (this.localState.opened) {
				if (this.localState.algorithm === targetDataId) {
					panel?.classList.remove('panel--opened')
					;(e.target as HTMLElement).classList.remove('menu__link--active')

					this.localState = {
						opened: false
					}
				} else {
					this.localState.algorithm = targetDataId
					;(e.target as HTMLElement).classList.add('menu__link--active')
					this.localState.activeElement.classList.remove('menu__link--active')

					this.localState.activeElement = e.target as HTMLElement
				}
			} else {
				panel?.classList.add('panel--opened')
				;(e.target as HTMLElement).classList.add('menu__link--active')

				this.localState = {
					opened: true,
					algorithm: targetDataId,
					activeElement: e.target as HTMLElement
				}
			}

			if (formHeading) {
				formHeading.textContent = targetDataId
			}
		})

		form?.addEventListener('submit', async e => {
			e.preventDefault()

			formCodeOutput.textContent = ''

			const start = document.querySelector('#panel__form--from')
			const to = document.querySelector('#panel__form--to')

			// @ts-expect-error TODO
			const algorithm = this.localState.algorithm

			if (algorithm === 'lb5third') {
				const activeId = new Date().getTime()
				this.algorithmActiveId = activeId

				// this.#graphNodesStatusResetter(activeId)

				this.lb5TaskThird(start?.value, to?.value)
				// .then(async value => {
				// 	console.log(value)

				// 	this.#graphNodesStatusResetter(activeId)
				// })

				return
			}

			// @ts-expect-error TODO
			const startNode = this.graph.graph.get(start.value)
			// @ts-expect-error TODO
			const endNode = this.graph.graph.get(to.value)

			if (!startNode || !endNode) return

			if (algorithm === 'lb5first') {
				const activeId = new Date().getTime()
				this.algorithmActiveId = activeId

				this.#graphNodesStatusResetter(activeId)

				startNode.status = 'done'

				const maxLevel = Number(to?.value) || 2

				this.lb5TaskOne(startNode, [], activeId, maxLevel).then(async value => {
					console.log(value)

					this.#graphNodesStatusResetter(activeId)
				})
			}

			if (algorithm === 'lb5second') {
				const activeId = new Date().getTime()
				this.algorithmActiveId = activeId

				this.#graphNodesStatusResetter(activeId)

				startNode.status = 'done'

				// const maxLevel = Number(to?.value) || 2

				this.lb5TaskSecond(activeId).then(async value => {
					console.log(value)

					this.#graphNodesStatusResetter(activeId)
				})
			}

			if (algorithm === 'lb6one') {
				const activeId = new Date().getTime()
				this.algorithmActiveId = activeId

				this.#graphNodesStatusResetter(activeId)

				startNode.status = 'done'
				this.render()

				const distances = await this.bellmanFord(startNode)

				if (distances) {
					const result = [...distances.entries()].reduce(
						(acc, [node, distance]) => {
							return {
								...acc,
								[node.value]: distance
							}
						},
						{}
					)

					formCodeOutput.textContent = JSON.stringify(result, null, 2)
				} else {
					console.log('Paths not found')
				}
			}

			if (algorithm === 'lb6two') {
				const activeId = new Date().getTime()
				this.algorithmActiveId = activeId

				this.#graphNodesStatusResetter(activeId)

				startNode.status = 'done'
				endNode.status = 'done'

				const result = await this.dijkstra(startNode, endNode)

				if (result === null) {
					formCodeOutput.textContent = 'Not found!'
				} else {
					formCodeOutput.textContent = result
						?.map(item => item.value)
						.join(' -> ')
				}
			}

			if (algorithm === 'lb6three') {
				const activeId = new Date().getTime()
				this.algorithmActiveId = activeId

				this.#graphNodesStatusResetter(activeId)

				const nodes = Array.from(this.graph.graph.values()).sort((a, b) => {
					return Number(a.value) - Number(b.value)
				})
				console.log('%c⧭', 'color: #731d1d', nodes)

				const result = await this.floydWarshall(nodes)

				result.unshift([])
				result.unshift(nodes.map(node => node.value))

				formCodeOutput.textContent = JSON.stringify(
					[
						...result.map(item => {
							const tmp: string[] = []

							item.map(subItem => {
								let s = String(subItem)

								if (subItem === Infinity) {
									s = '-'
								}

								if (s.length < 2) {
									s = ' ' + s
								}

								if (s.length < 3 && s.length === 2) {
									s = ' ' + s
								}

								tmp.push(s)
							})

							return tmp.join(',')
						})
					],
					null,
					2
				)
				// .then(async () => {
				// 	console.log('asdsd')
				// 	// await sleep(DELAY)

				// 	this.#graphNodesStatusResetter(activeId)
				// })
			}

			// if (algorithm === 'find-one-path') {
			// 	const path: Node[] = []

			// 	const activeId = new Date().getTime()
			// 	this.algorithmActiveId = activeId

			// 	this.#graphNodesStatusResetter(activeId)

			// 	startNode.status = 'done'
			// 	endNode.status = 'done'

			// 	this.findPath(startNode, endNode, [], path, activeId).then(async () => {
			// 		console.log('asdsd')
			// 		// await sleep(DELAY)

			// 		this.#graphNodesStatusResetter(activeId)
			// 	})
			// }

			// if (algorithm === 'find-all-paths') {
			// 	const path: Node[][] = []

			// 	const activeId = new Date().getTime()
			// 	this.algorithmActiveId = activeId

			// 	this.#graphNodesStatusResetter(activeId)

			// 	startNode.status = 'done'
			// 	endNode.status = 'done'

			// 	console.log(
			// 		await this.findPathes(startNode, endNode, new Set(), path, activeId)
			// 	)

			// 	await sleep(DELAY)

			// 	this.#graphNodesStatusResetter(activeId)

			// 	console.log(path)
			// }
		})
	}
}

const app = new App()

app.initializeApp()

/*

Ориентированный:
- У нас есть направления по которому мы проходим

Не ориентированый:
- У нас нет направления и мы можем идти куда хотим

Варианты:
- Добавить в edges создание не 1 edge, а 2, только у 1 будет status - standart, а у второй - no-direction
  А при создании из 2 в 1 - заменять у второй с no-direction на `standart`
	При удалении - изменять на no-direction

*/
