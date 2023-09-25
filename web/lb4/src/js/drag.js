const dragElement = document.querySelector('#drag')

let dragging = false

let startX = 0
let startY = 0

dragElement.addEventListener('mousedown', e => {
	dragging = true

	const style = window.getComputedStyle(dragElement)

	const transform = new DOMMatrixReadOnly(style.transform)

	const translateX = transform.m41
	const translateY = transform.m42

	startX = e.pageX - translateX
	startY = e.pageY - translateY
})

document.body.addEventListener('mousemove', e => {
	if (!dragging) return

	const x = e.pageX - startX
	const y = e.pageY - startY

	dragElement.style.transform = `translate(${x}px, ${y}px)`
})

document.body.addEventListener('mouseup', () => {
	dragging = false
})
