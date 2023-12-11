export function validateEMail(eMail: string): string[] {
	const inValidations: string[] = [];

	if (!/\S+@\S+\.\S+/.test(eMail)) inValidations.push('inValid eMail');

	return inValidations;
};

export function validatePassWord(passWord: string): string[] {
	const inValidations: string[] = [];

	if (passWord.length < 4) inValidations.push('inValid passWord');

	return inValidations;
};