const navigationBurger = document.querySelector('#navigationBurger')
const navigationList = document.querySelector('#navigationList')

navigationBurger.addEventListener('click', () => {
	navigationList.classList.toggle('navigation__list--hidden')
})
