import * as chalk from 'chalk'
import { FirstTask } from './FirstTask.class'
import { SecondTask } from './SecondTask.class'

console.log(chalk.yellow('Lab 4 | Algoritms\n'))

console.log(chalk.bgRed('Lab 4 | First task\n'))
const firstTask = new FirstTask()

const firstTaskCheckData = [
	{
		input: [0, 1, 0, 3, 2, 3],
		expectedOutput: [3, 2]
	},
	{
		input: [10, 9, 2, 5, 3, 7, 101, 18],
		expectedOutput: [10, 9, 5, 3]
	},
	{
		input: [5, 8, 7, 1, 2, 10, 3],
		expectedOutput: [8, 7, 3]
	},
	{
		input: [1, 3, 6, 7, 9, 4, 10, 5, 6],
		expectedOutput: [10, 6]
	},
	{
		input: [3, 4, 2, 8, 10],
		expectedOutput: [4, 2]
	},
	{
		input: [1, 2, 3, 4, 5],
		expectedOutput: [5]
	},
	{
		input: [5, 4, 3, 2, 1],
		expectedOutput: [5, 4, 3, 2, 1]
	},
	{
		input: [1],
		expectedOutput: [1]
	},
	{
		input: [],
		expectedOutput: []
	},
	{
		input: [2, 2, 2, 2, 2],
		expectedOutput: [2]
	}
]

const testData = []

firstTaskCheckData.forEach(test => {
	const actual = firstTask.resolve(test.input)

	testData.push({
		pass: JSON.stringify(test.expectedOutput) === JSON.stringify(actual),
		input: JSON.stringify(test.input),
		expected: JSON.stringify(test.expectedOutput),
		actual: JSON.stringify(actual),
		l: actual.length
	})
})

console.table(testData)

console.log(chalk.bgBlue('\nLab 4 | Second task\n'))
const secondTask = new SecondTask()

const dataForSecond = [
	{
		matrix: [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		],
		count: 6
	},
	{
		matrix: [
			[1, 1, 0],
			[1, 0, 1],
			[0, 1, 1]
		],
		count: 6
	},
	{
		matrix: [
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1]
		],
		count: 6
	},
	{
		matrix: [
			[1, 1, 1],
			[1, 1, 1],
			[1, 1, 1]
		],
		count: 7
	}
]

dataForSecond.forEach(data => {
	const result = secondTask.resolve(data.matrix, data.count)

	console.log(
		`On matrix = ${JSON.stringify(data.matrix)}, count = ${
			data.count
		} result = ${result.length}\n${JSON.stringify(result)}`
	)
})
