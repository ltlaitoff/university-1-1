import { Book } from './Book'

const NAMES = [
	'Bartell - Harris',
	'Schoen Inc',
	'Labadie - Rodriguez',
	'Weimann LLC',
	'Veum - Tillman',
	'Willms Inc',
	'Heller, Deckow and Funk',
	'Buckridge, Gutmann and Gaylord',
	'Boehm and Sons',
	'Rempel - Bruen',
	'Boyer, Wisoky and Altenwerth',
	'Steuber, Kovacek and Huels',
	'Ruecker, Jacobs and Daniel',
	'Abbott, Gutkowski and Waelchi',
	'Cartwright - Kuhlman',
	'Maggio - Zboncak',
	'Waelchi Group',
	'Hilll - Bode',
	'Marks - Stroman'
]

const TITLES = [
	'Virtual non-volatile toolset',
	'Cloned neutral functionalities',
	'Digitized cohesive flexibility',
	'Face to face systemic utilisation',
	'Operative real-time application',
	'Vision-oriented intermediate collaboration',
	'Versatile modular circuit',
	'Switchable fault-tolerant conglomeration',
	'Implemented methodical matrices',
	'Open-architected bi-directional data-warehouse',
	'Inverse intangible conglomeration',
	'Sharable intangible migration',
	'Re-contextualized system-worthy adapter',
	'Diverse upward-trending core',
	'Streamlined well-modulated framework',
	'Devolved background standardization',
	'Advanced content-based time-frame',
	'Cross-platform local groupware',
	'User-centric foreground middleware'
]

const GENRE = [
	'motivating',
	'system-worthy',
	'maximized',
	'client-server',
	'systematic',
	'fresh-thinking',
	'bi-directional',
	'multimedia',
	'global',
	'tertiary',
	'didactic',
	'leading edge',
	'client-driven',
	'empowering',
	'discrete',
	'user-facing',
	'non-volatile',
	'actuating',
	'impactful'
]

export function randomGenerateBook() {
	const publicationYear: number = Math.abs(Math.floor(Math.random() * 5000))
	const pageCount: number = Math.abs(Math.floor(Math.random() * 1000))
	let totalCopies: number = Math.abs(Math.floor(Math.random() * 50))
	let copiesCheckedOut: number = Math.abs(Math.floor(Math.random() * 50))

	if (copiesCheckedOut > totalCopies) {
		;[totalCopies, copiesCheckedOut] = [copiesCheckedOut, totalCopies]
	}

	return new Book(
		NAMES[Math.floor(Math.random() * NAMES.length)],
		TITLES[Math.floor(Math.random() * TITLES.length)],
		GENRE[Math.floor(Math.random() * GENRE.length)],
		'SITE.com',
		publicationYear,
		pageCount,
		totalCopies,
		copiesCheckedOut
	)
}
