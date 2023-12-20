import { BringWater } from './water'
import { EncodeAndDecode } from './encodeAndDecode'

const bringWater = new BringWater(0, [])

const waterForm = document.querySelector('#water-form')
const waterBarrel = document.querySelector('#water-barrel')
const waterBuckets = document.querySelector('#water-buckets')
const waterOutput = document.querySelector('#water-output')

waterForm?.addEventListener('submit', e => {
	e.preventDefault()

	bringWater.buckets = waterBuckets.value.split(',').map(Number) ?? []
	bringWater.barrelСapacity = Number(waterBarrel.value)

	waterOutput.textContent = JSON.stringify(bringWater.result, null, 2)
})

const encodeAndDecode = new EncodeAndDecode()

const haffmanForm = document.querySelector('#haffman-form')
const haffmanInput = document.querySelector('#haffman-input')
const haffmanEncoded = document.querySelector('#haffman-encoded')
const haffmanTree = document.querySelector('#haffman-tree')
const haffmanDecoded = document.querySelector('#haffman-decoded')

haffmanForm?.addEventListener('submit', e => {
	e.preventDefault()

	const res = encodeAndDecode.encodeFromFileToFiles(haffmanInput.value)
	haffmanEncoded.textContent = res.string
	haffmanTree.textContent = JSON.stringify(res.tree, null, 2)

	haffmanDecoded.textContent = encodeAndDecode.decodeFromFilesToFile(
		haffmanEncoded.textContent,
		haffmanTree.textContent
	)
})
