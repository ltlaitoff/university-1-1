/*
В. Послідовність складається з деякого набору цілих чисел.
Елементи послідовності можуть бути, як від’ємними, так і
невід’ємними цілими числами. 

Визначити найдовшу спадну підпослідовність даної послідовності. 

Вивести на екран довжину такої послідовності та всі її члени.
*/

class FirstTask {
	resolve(
		nums: number[],
		index: number = 0,
		previous: number = Infinity
	): number[] {
		if (index === nums.length) return []

		const excludeCurrent = this.resolve(nums, index + 1, previous)

		if (nums[index] >= previous) return excludeCurrent

		const includeCurrent: number[] = [
			nums[index],
			...this.resolve(nums, index + 1, nums[index])
		]

		return includeCurrent.length > excludeCurrent.length
			? includeCurrent
			: excludeCurrent
	}
}

export { FirstTask }
