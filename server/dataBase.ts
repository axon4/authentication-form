import { AsyncDatabase } from 'promised-sqlite3';
import { v4 as UUID } from 'uuid';
import { Hash } from './authentication';

interface User {
	ID: number;
	eMail: string;
	hash: Hash;
	termsAndConditions: boolean;
};

interface UserRepository {
	create(user: User): Promise<User>;
	get(ID: number): Promise<User | undefined>;
	find(eMail: string): Promise<User | undefined>;
};

export class SQLiteUserRepository implements UserRepository {
	constructor(private readonly dataBase: AsyncDatabase) {};

	async create(user: User): Promise<User> {
		const { ID }: {ID: number} = await this.dataBase.get('INSERT INTO users ("eMail", hash, "termsAndConditions") VALUES (?, ?, ?) RETURNING "ID";', [user.eMail, user.hash.hash, user.termsAndConditions]);

		return { ... user, ID };
	};

	async get(ID: number): Promise<User | undefined> {
		return await this.dataBase.get('SELECT * FROM users WHERE "ID" = ?;', ID);
	};

	async find(eMail: string): Promise<User | undefined> {
		return await this.dataBase.get('SELECT * FROM users WHERE "eMail" = ?;', eMail);
	};
};

class SQLiteSession {
	constructor(private readonly dataBase: AsyncDatabase) {};

	async create(userID: number): Promise<string> {
		const sessionID = UUID();

		this.dataBase.run('INSERT INTO sessions ("sessionID", "userID") values (?, ?);', [sessionID, userID]);

		return sessionID;
	};

	async get(ID: number): Promise<User | undefined> {
		const userID: {userID: number} | undefined = await this.dataBase.get('SELECT "userID" FROM sessions WHERE "sessionID" = ?;', ID);

		if (userID === undefined) return undefined;
		else {
			const users = new SQLiteUserRepository(this.dataBase);

			return await users.get(userID.userID);
		};
	};
};

export async function connect(connectionString: string): Promise<AsyncDatabase> {
	return await AsyncDatabase.open(connectionString);
};

export async function seed(dataBase: AsyncDatabase): Promise<void> {
	return dataBase.exec(`
		CREATE TABLE IF NOT EXISTS users (
			"ID" INTEGER PRIMARY KEY,
			"eMail" TEXT UNIQUE NOT NULL,
			hash TEXT NOT NULL,
			"termsAndConditions" BOOLEAN NOT NULL
		);

		CREATE TABLE IF NOT EXISTS sessions (
			"sessionID" UUID PRIMARY KEY,
			"userID" INTEGER NOT NULL,
			FOREIGN KEY ("userID") REFERENCES USERS("ID") ON DELETE CASCADE
		);
	`);
};