const formNameElement = $('#form-name')[0]
const formEmailElement = $('#form-email')[0]
const formTelephoneElement = $('#form-telephone')[0]
const feedbackElement = $('#feedback')[0]

const FEEDBACK_BASE_TEXT = 'Feedback'

$('#form').on('submit', formSubmit)
$('#form-text').on('input', updateTextLength)

function formSubmit(e) {
	e.preventDefault()

	if (isNameError(formNameElement.value)) {
		return alert('Error in name')
	}

	if (isEmailError(formEmailElement.value)) {
		return alert('Error in email')
	}

	if (isPhoneError(formTelephoneElement.value)) {
		return alert('Error in telephone')
	}
}

function isNameError(text) {
	if (text.length === 0) return true

	return !/^[А-ЩЬЮЯҐЄІЇа-щьюяґєіїA-Za-zA-Za-z\s]*$/.test(text)
}

function isEmailError(text) {
	if (text.length === 0) return true

	return !/^[a-z0-9]+@[a-z]+\.[a-z]+$/.test(text)
}

function isPhoneError(text) {
	if (text.length === 0) return true

	return !/^[0-9\s\(\)\-\+]+$/.test(text)
}

function updateTextLength(e) {
	feedbackElement.textContent = `${FEEDBACK_BASE_TEXT} (${e.target.value.length} symbols)`
}
