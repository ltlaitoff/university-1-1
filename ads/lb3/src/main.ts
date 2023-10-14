import * as readline from 'node:readline'
import * as nodeProcess from 'node:process'
import * as chalk from 'chalk'

const { stdin: input, stdout: output } = nodeProcess

import { BringWater } from './water'

const bringWater = new BringWater(0, [])

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

function individualSetBarrelCapacityInput(): Promise<void> {
	return new Promise(resolve => {
		const menuString = `\nInput new barrel capacity(current = ${bringWater.barrelСapacity}): `

		rl.question(menuString, async answer => {
			console.clear()

			try {
				const number = Number(answer)

				if (number < 0) {
					throw new Error('Not valid input')
				}

				bringWater.barrelСapacity = number
				resolve()
				return
			} catch {
				console.log(chalk.red('Not valid input! Try again'))
			}

			await individualSetBarrelCapacityInput()
			resolve()
		})
	})
}

function individualSetBuckets(): Promise<void> {
	return new Promise(resolve => {
		const menuString = `\nInput new buckets sizes in line with "," as divider (current = [${bringWater.buckets.join(
			','
		)}]): `

		rl.question(menuString, async answer => {
			console.clear()

			try {
				const buckets = answer.split(',').map(Number)

				buckets.forEach(bucket => {
					if (isNaN(bucket)) throw new Error()
				})

				bringWater.buckets = structuredClone(buckets)
				resolve()
				return
			} catch {
				console.log(chalk.red('Not valid input! Try again'))
			}

			await individualSetBuckets()
			resolve()
		})
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
		`\nFile menu:\n` + `(0) - Close program\n` + `\nInput(default - 0): `

	rl.question(menuString, answer => {
		console.clear()

		try {
			const number = Number(answer)

			if (number === 0) {
				menu()
				return
			}

			throw new Error('Not valid input')
		} catch {
			console.log(chalk.red('Not valid input! Try again'))
		}

		fileMenu()
	})
}

menu()
