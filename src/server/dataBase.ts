import { AsyncDatabase } from 'promised-sqlite3';
import { v4 as UUID } from 'uuid';
import { Hash } from './authentication';

export interface User {
	ID: number;
	eMail: string;
	hash: Hash;
	termsAndConditions: boolean;
};

interface UserForDataBase extends Omit<User, 'hash'> {
	hash: string;
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
		const user: UserForDataBase | undefined = await this.dataBase.get('SELECT * FROM users WHERE "ID" = ?;', ID);

		if (!user) return undefined;
		else return {...user, hash: new Hash(user.hash)};
	};

	async find(eMail: string): Promise<User | undefined> {
		const ID: {ID: number} | undefined = await this.dataBase.get('SELECT "ID" FROM users WHERE "eMail" = ?;', eMail);

		if (!ID) return undefined;
		else return await this.get(ID.ID);
	};
};

interface SessionRepository {
	create(userID: number): Promise<string>;
	get(ID: string): Promise<User | undefined>;
};

export class SQLiteSessionRepository implements SessionRepository {
	constructor(private readonly dataBase: AsyncDatabase) {};

	async create(userID: number): Promise<string> {
		const sessionID = UUID();

		this.dataBase.run('INSERT INTO sessions ("sessionID", "userID") values (?, ?);', [sessionID, userID]);

		return sessionID;
	};

	async get(ID: string): Promise<User | undefined> {
		const userID: {userID: number} | undefined = await this.dataBase.get('SELECT "userID" FROM sessions WHERE "sessionID" = ?;', ID);

		if (!userID) return undefined;
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