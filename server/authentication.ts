import bCrypt from 'bcrypt';

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

export class Hash {
	constructor (readonly hash: string) {};
};

const saltRounds = 7;

export async function hash(plain: string): Promise<Hash> {
	return await new Promise((resolve, reject) => {
		bCrypt.hash(plain, saltRounds, (error, hash) => {
			if (error) reject(error);
			else resolve(new Hash(hash));
		});
	});
};

export async function authenticate(plain: string, hash: Hash): Promise<boolean> {
	return await bCrypt.compare(plain, hash.hash);
};