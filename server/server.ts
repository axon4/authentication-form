import path from 'path';
import dotEnv from 'dotenv';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import staticFiles from '@fastify/static';
import cookie from '@fastify/cookie';
import formBody from '@fastify/formbody';
import { z } from 'zod';
import nunJucks from 'nunjucks'; 
import { clearFlashMessageCookie, flashMessageCookieKey } from './middleWare';
import { SQLiteSessionRepository, SQLiteUserRepository, connect, seed } from './dataBase';
import { authenticate, hash } from './authentication';

dotEnv.config();

const environment = process.env.NODE_ENV;
const cookieSecret = process.env.COOKIE_SECRET;

if (!cookieSecret) {
	console.error('missing environment-variable: COOKIE_SECRET');
	process.exit(1);
};

const server = fastify({logger: true});
const dataBaseConnectionString = path.join(__dirname, 'dataBase.sqlite');
const templates = new nunJucks.Environment(new nunJucks.FileSystemLoader(path.join(__dirname, 'templates')));

server.register(staticFiles, {root: path.join(__dirname, '../dist')});
server.register(clearFlashMessageCookie);
server.register(cookie, {secret: cookieSecret});
server.register(formBody);

function setFlashMessageCookie(response: FastifyReply, message: string) {
	response.setCookie(flashMessageCookieKey, message, {path: '/'});
};

function getFlashMessageCookie(request: FastifyRequest) {
	return request.cookies[flashMessageCookieKey];
};

const sessionCookieKey = 'SESSION_ID';

function setSessionCookie(response: FastifyReply, sessionID: string) {
	response.setCookie(sessionCookieKey, sessionID, {path: '/'});
};

function getSessionCookie(request: FastifyRequest) {
	return request.cookies[sessionCookieKey];
};

server.get('/', async (_request, response) => {
	await response.redirect('/log-in');
});

const registrationSchema = z.object({
	eMail: z.string(),
	passWord: z.string(),
	termsAndConditions: z.string().optional()
});

type Registration = z.infer<typeof registrationSchema>;

server.get('/register', async (_request, response) => {
	const rendered = templates.render('register.njk', { environment });

	await response.header('Content-Type', 'text/html; charset=UTF-8').send(rendered);
});

server.post('/register', async (request, response) => {
	let data!: Registration;

	try {
		data = registrationSchema.parse(request.body);
	} catch (error) {
		setFlashMessageCookie(response, 'Error Registering');
		await response.redirect('/register');
	};

	if (data.termsAndConditions !== 'on') {
		setFlashMessageCookie(response, 'Terms & Conditions Must be Accepted');
		await response.redirect('/register');
	};

	const dataBase = await connect(dataBaseConnectionString);
	const userRepository = new SQLiteUserRepository(dataBase);
	const hashedPassWord = await hash(data.passWord);

	try {
		const newUser = {
			...data,
			ID: 7,
			hash: hashedPassWord,
			termsAndConditions: true
		};
		const user = await userRepository.create(newUser);
		const session = new SQLiteSessionRepository(dataBase);
		const sessionID = await session.create(user.ID);

		setSessionCookie(response, sessionID);
		await response.redirect('/home');
	} catch (error) {
		setFlashMessageCookie(response, 'Error Getting New User');
		await response.redirect('/register');
	};
});

const logInSchema = z.object({
	eMail: z.string(),
	passWord: z.string()
});

type LogIn = z.infer<typeof logInSchema>;

server.get('/log-in', async (_request, response) => {
	const rendered = templates.render('logIn.njk', { environment });

	await response.header('Content-Type', 'text/html; charset=UTF-8').send(rendered);
});

server.post('/log-in', async (request, response) => {
	let data!: LogIn;

	try {
		data = registrationSchema.parse(request.body);
	} catch (error) {
		setFlashMessageCookie(response, 'Error Logging-In');
		await response.redirect('/log-in');
	};

	const dataBase = await connect(dataBaseConnectionString);
	const userRepository = new SQLiteUserRepository(dataBase);

	try {
		const user = await userRepository.find(data.eMail);

		if (!user) {
			setFlashMessageCookie(response, 'User Not Found');
			await response.redirect('/log-in');
		};

		const match = await authenticate(data.passWord, user!.hash);

		if (match) {
			const session = new SQLiteSessionRepository(dataBase);
			const sessionID = await session.create(user!.ID);

			setSessionCookie(response, sessionID);
			await response.redirect('/home');
		} else {
			setFlashMessageCookie(response, 'InCorrect PassWord')
			await response.redirect('/log-in');
		};
	} catch (error) {
		setFlashMessageCookie(response, 'Error Getting Existing User');
		await response.redirect('/log-in');
	};
});

(async function() {
	try {
		const dataBase = await connect(dataBaseConnectionString);

		await seed(dataBase);
		await server.listen({port: 3000});
	} catch (error) {
		server.log.error(error);
		process.exit(1);
	};
})();