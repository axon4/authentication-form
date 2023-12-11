import Errors from './errors';
import { validateEMail, validatePassWord } from '../validate';

const eMailField = document.getElementById('eMail') as HTMLInputElement;
const eMailErrorLabel = document.getElementById('eMail-error') as HTMLParagraphElement;
const passWordField = document.getElementById('passWord') as HTMLInputElement;
const passWordErrorLabel = document.getElementById('passWord-error') as HTMLParagraphElement;
const button = document.getElementById('submit') as HTMLButtonElement;
const errors = new Errors();

function upDateButtonAbility() {
	console.log('bool', eMailField.value.length > 0 && passWordField.value.length > 0 && errors.isEmpty)
	button.classList[eMailField.value.length > 0 && passWordField.value.length > 0 && errors.isEmpty ? 'remove' : 'add']('btn-disabled');
};

eMailField.addEventListener('input', () => {
	const inValidations = validateEMail(eMailField.value);

	if (inValidations.length > 0) {
		const forMattedErrors = inValidations.join('<br />');

		errors.set('eMail', eMailField, eMailErrorLabel, forMattedErrors);
	} else errors.unset('eMail', eMailField, eMailErrorLabel);

	upDateButtonAbility();
});
passWordField.addEventListener('input', () => {
	const inValidations = validatePassWord(passWordField.value);

	if (inValidations.length > 0) {
		const forMattedErrors = inValidations.join('<br />');

		errors.set('passWord', passWordField, passWordErrorLabel, forMattedErrors);
	} else errors.unset('passWord', passWordField, passWordErrorLabel);

	upDateButtonAbility();
});