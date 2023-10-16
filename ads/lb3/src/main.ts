import * as readline from 'node:readline'
import * as nodeProcess from 'node:process'
import * as chalk from 'chalk'

const { stdin: input, stdout: output } = nodeProcess

import { BringWater } from './water'
import { EncodeAndDecode } from './encodeAndDecode'

const bringWater = new BringWater(0, [])
const encodeAndDecode = new EncodeAndDecode()

/*
	Menu 1:
	(0) - Individual task
	(1) - File task

	Menu individual:
	(1) - Set data
	(2) - Change barrelСapacity
	(3) - Change buckets
	(4) - Show result
	(0) - Go back

	File menu:
	(1) - Encode from file
	(2) - Decode from files
	(0) - Go back
*/

const rl = readline.createInterface({ input, output })

function menu() {
	const menuString =
		`\nChoice menu:\n` +
		`(1) - Individual task\n` +
		`(2) - File task\n` +
		`(0) - Close program\n` +
		`\nInput(default - 0): `

	rl.question(menuString, answer => {
		console.clear()
		try {
			const number = Number(answer)

			switch (number) {
				case 0: {
					rl.close()
					return
				}

				case 1: {
					individualMenu()
					break
				}

				case 2: {
					fileMenu()
					break
				}

				default: {
					throw new Error('Not valid input')
				}
			}
		} catch {
			console.log(chalk.red('Not valid input! Try again'))
		}

		menu()
	})
}

function consoleQuestion(
	questionString: string,
	callback: (answer: string) => void
): Promise<void> {
	return new Promise(resolve => {
		rl.question(questionString, async answer => {
			console.clear()

			try {
				callback(answer)
				resolve()
				return
			} catch {
				console.log(chalk.red('Not valid input! Try again'))
			}

			await consoleQuestion(questionString, callback)
			resolve()
		})
	})
}

function individualSetBarrelCapacityInput(): Promise<void> {
	const question = `\nInput new barrel capacity(current = ${bringWater.barrelСapacity}): `

	return consoleQuestion(question, (answer: string) => {
		const number = Number(answer)

		if (number < 0) {
			throw new Error('Not valid input')
		}

		bringWater.barrelСapacity = number
	})
}

function individualSetBuckets(): Promise<void> {
	const question = `\nInput new buckets sizes in line with "," as divider (current = [${bringWater.buckets.join(
		','
	)}]): `

	return consoleQuestion(question, (answer: string) => {
		const buckets = answer.split(',').map(Number)

		buckets.forEach(bucket => {
			if (isNaN(bucket)) throw new Error()
		})

		bringWater.buckets = structuredClone(buckets)
	})
}

function individualMenu() {
	const menuString =
		`\nMenu individual:\n` +
		`(1) - Set data\n` +
		`(2) - Change barrelСapacity\n` +
		`(3) - Change buckets\n` +
		`(4) - Show result\n` +
		`(0) - Go back\n` +
		`\nInput(default - 0): `

	rl.question(menuString, async answer => {
		console.clear()

		try {
			const number = Number(answer)

			switch (number) {
				case 0: {
					menu()
					return
				}

				case 1: {
					await individualSetBarrelCapacityInput()
					await individualSetBuckets()
					break
				}

				case 2: {
					await individualSetBarrelCapacityInput()
					break
				}

				case 3: {
					await individualSetBuckets()
					break
				}

				case 4: {
					console.log(bringWater.result)
					break
				}

				default:
					throw new Error('Not valid input')
			}
		} catch {
			console.log(chalk.red('Not valid input! Try again'))
		}

		individualMenu()
	})
}

function fileMenu() {
	const menuString =
		`\nFile menu:\n` +
		`(1) - Encode file\n` +
		`(2) - Decode files\n` +
		`(0) - Close program\n` +
		`\nInput(default - 0): `

	rl.question(menuString, async answer => {
		console.clear()

		try {
			const number = Number(answer)

			switch (number) {
				case 1: {
					let filePathForEncode = ''

					await consoleQuestion(
						`\nInput file location (default = "/files/textForEncode"): `,
						(answer: string) => {
							if (answer.trim() === '') {
								filePathForEncode = './files/textForEncode'
								return
							}

							filePathForEncode = answer
						}
					)

					let filePathBinary = ''
					await consoleQuestion(
						`\nInput output file path (default = "/files/binary"): `,
						(answer: string) => {
							if (answer.trim() === '') {
								filePathBinary = './files/binary'
								return
							}

							filePathBinary = answer
						}
					)

					let filePathTree = ''
					await consoleQuestion(
						`\nInput tree file path (default = "/files/tree.json"): `,
						(answer: string) => {
							if (answer.trim() === '') {
								filePathTree = './files/tree.json'
								return
							}

							filePathTree = answer
						}
					)

					encodeAndDecode.encodeFromFileToFiles(
						filePathForEncode,
						filePathBinary,
						filePathTree
					)
					break
				}

				case 2: {
					let filePathForDecode = ''

					await consoleQuestion(
						`\nInput file location (default = "/files/binary"): `,
						(answer: string) => {
							if (answer.trim() === '') {
								filePathForDecode = './files/binary'
								return
							}

							filePathForDecode = answer
						}
					)

					let filePathTree = ''
					await consoleQuestion(
						`\nInput tree file path (default = "/files/tree.json"): `,
						(answer: string) => {
							if (answer.trim() === '') {
								filePathTree = './files/tree.json'
								return
							}

							filePathTree = answer
						}
					)

					let fileForOutput = ''
					await consoleQuestion(
						`\nInput output file path (default = "/files/decodeOutput"): `,
						(answer: string) => {
							if (answer.trim() === '') {
								fileForOutput = './files/decodeOutput'
								return
							}

							fileForOutput = answer
						}
					)

					encodeAndDecode.decodeFromFilesToFile(
						filePathForDecode,
						filePathTree,
						fileForOutput
					)
					break
				}

				case 0: {
					menu()
					return
				}

				default:
					throw new Error('Not valid input')
			}
		} catch (e) {
			console.log(e)
			console.log(chalk.red('Not valid input! Try again'))
		}

		fileMenu()
	})
}

console.clear()
menu()
