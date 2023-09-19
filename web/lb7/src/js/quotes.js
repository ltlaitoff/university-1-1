import { quotes } from '../assets/data/data.js'

function getRandomQuote() {
	const index = Math.floor(Math.random() * quotes.length)

	return quotes[index]
}

const quotePlace = $('#quotePlace')[0]
quotePlace.textContent = getRandomQuote()
