import bCrypt from 'bcrypt';

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