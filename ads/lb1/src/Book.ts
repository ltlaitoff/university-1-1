/*
Книжки в бібліотеці характеризуються наступними даними:
– автор;
– назва;
– жанр;
– видавництво;
– рік публікації;
– кількість сторінок;
– загальна кількість екземплярів;
– кількість екземплярів у читачів.
*/

class Book {
	author: string
	title: string
	genre: string
	publisher: string
	publicationYear: number
	pageCount: number
	totalCopies: number
	copiesCheckedOut: number

	constructor(
		author: string,
		title: string,
		genre: string,
		publisher: string,
		publicationYear: number,
		pageCount: number,
		totalCopies: number,
		copiesCheckedOut: number
	) {
		this.author = author
		this.title = title
		this.genre = genre
		this.publisher = publisher
		this.publicationYear = publicationYear
		this.pageCount = pageCount
		this.totalCopies = totalCopies
		this.copiesCheckedOut = copiesCheckedOut
	}

	valueOf() {
		return this.totalCopies - this.copiesCheckedOut
	}

	clone() {
		return new Book(
			this.author,
			this.title,
			this.genre,
			this.publisher,
			this.publicationYear,
			this.pageCount,
			this.totalCopies,
			this.copiesCheckedOut
		)
	}
}

export { Book }
