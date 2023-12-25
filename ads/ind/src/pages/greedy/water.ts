/*
Варіант No 3.
На дачі стоїть велика діжка, яка вміщує задану кількість рідини.
Хазяїн використовує її для поливу рослин, але не маючи
централізованого водопостачання, має принести воду з річки. У його
розпорядженні є відра заданого обсягу. Визначити, яку мінімальну
кількість відер води хазяїну потрібно принести з річки, щоб заповнити
діжку. Вважати, що кожне відро може бути принесене тільки повністю
заповненим, адже хазяїн не хоче носити зайвий вантаж. Результати
виводити, демонструючи кількість відер кожного обсягу.
*/

class BringWater {
	barrelСapacity = 0
	private _buckets: number[] = []

	constructor(barrelСapacity: number, buckets: number[]) {
		this.barrelСapacity = barrelСapacity
		this.buckets = buckets
	}

	get buckets() {
		return this._buckets
	}

	set buckets(newBuckets) {
		this._buckets = newBuckets.sort((a, b) => a - b)
	}

	get result() {
		let notFilledCapacity = this.barrelСapacity

		const usedBuckets: Record<number, number> = {}

		if (this.buckets.length === 0) {
			return 'Buckets must be!'
		}

		while (notFilledCapacity > 0) {
			for (let i = 0; i < this.buckets.length; i++) {
				const bucket = this.buckets[i]

				if (notFilledCapacity <= bucket || i === this.buckets.length - 1) {
					if (!(bucket in usedBuckets)) {
						usedBuckets[bucket] = 0
					}

					usedBuckets[bucket]++
					notFilledCapacity -= bucket
					break
				}
			}
		}

		return usedBuckets
	}
}

export { BringWater }
