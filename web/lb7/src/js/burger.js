const navigationList = $('#navigationList')[0]

$('#navigationBurger').on('click', () => {
	navigationList.classList.toggle('navigation__list--hidden')
})
