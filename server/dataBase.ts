import { AsyncDatabase } from 'promised-sqlite3';

interface User {
	ID: number;
	eMail: string;
	hash: string;
	termsAndConditions: boolean;
};

interface UserRepository {
	create(user: User): Promise<User>;
	get(ID: number): Promise<User | undefined>;
	find(eMail: string): Promise<User | undefined>;
};

class SQLiteUserRepository implements UserRepository {
	constructor(private readonly dataBase: AsyncDatabase) {};

	async create(user: User): Promise<User> {
		const { ID }: {ID: number} = await this.dataBase.get('INSERT INTO users ("eMail", hash, "termsAndConditions") VALUES (?, ?, ?) RETURNING "ID";', [user.eMail, user.hash, user.termsAndConditions]);

		return { ... user, ID };
	};

	async get(ID: number): Promise<User | undefined> {
		return await this.dataBase.get('SELECT * FROM users WHERE "ID" = ?', ID);
	};

	async find(eMail: string): Promise<User | undefined> {
		return await this.dataBase.get('SELECT * FROM users WHERE "eMail" = ?', eMail);
	};
};

async function connect(connectionString: string): Promise<AsyncDatabase> {
	return await AsyncDatabase.open(connectionString);
};

async function seed(dataBase: AsyncDatabase): Promise<void> {
	return dataBase.exec(`
		CREATE TABLE IF NOT EXISTS users (
			"ID": INTEGER PRIMARY KEY,
			"eMail": TEXT UNIQUE NOT NULL,
			hash: TEXT NOT NULL,
			"termsAndConditions": BOOLEAN NOT NULL
		);

		CREATE TABLE IF NOT EXISTS sessions (
			"sessionID": UUID PRIMARY KEY,
			"userID": INTEGER NOT NULL,
			FOREIGN KEY ("userID") REFERENCES USERS("ID") ON DELETE CASCADE
		);
	`);
};