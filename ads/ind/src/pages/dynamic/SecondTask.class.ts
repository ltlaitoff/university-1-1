/*
Д. На одній з вулиць містечка будинки класифіковано за трьома
типами: перший – звичайні житлові споруди, другий – промислові
споруди, а третій – міські заклади (лікарні, школи тощо). 

У результаті вулиця схематично зображена набором літер, кожна з яких визначає
тип будинку. У процесі збору інформації про місто була створена
матриця – таблиця, в якій кожен стовпчик і рядок відповідають
одному з типів будівель. 

Відповідно клітинка такої таблиці визначає,
чи розташовані на даній вулиці міста поруч будівлі заданого типу.
Матриця симетрична.

Визначити, скільки існує способів взаємного
розташування будинків даних типів між собою за заданою матрицею
для заданої кількості будинків на вулиці, 

тобто кількість можливих
наборів літер заданої довжини, що відповідають заданій матриці.
*/

class SecondTask {
	checkItemOnValid(matrix: number[][], item: string) {
		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix[i].length; j++) {
				if (matrix[i][j] === 0) continue

				if (!(item.includes(`${i}${j}`) || item.includes(`${j}${i}`))) {
					return false
				}
			}
		}

		return true
	}

	resolve(matrix: number[][], count: number): string[] {
		const results: string[] = []

		const inner = (result: string = '', currentIndex: number = 0): void => {
			if (currentIndex === count) {
				if (this.checkItemOnValid(matrix, result)) {
					results.push(result)
				}

				return
			}

			for (let type = 0; type < 3; type++) {
				if (matrix[type][result[currentIndex - 1]] === 0) {
					continue
				}

				inner(result + type, currentIndex + 1)
			}
		}

		inner()

		return results
	}
}

export { SecondTask }
