import path from 'path';
import dotEnv from 'dotenv';
import fastify from 'fastify';
import staticFiles from '@fastify/static';
import cookie from '@fastify/cookie';
import formBody from '@fastify/formbody';
import nunJucks from 'nunjucks'; 
import { connect, seed } from './dataBase';

dotEnv.config();

const environment = process.env.NODE_ENV;
const cookieSecret = process.env.COOKIE_SECRET;

if (!cookieSecret) {
	console.error('missing environment-variable: COOKIE_SECRET');
	process.exit(1);
};

const server = fastify({logger: true});
const dataBaseConnectionString = path.join(__dirname, 'users.sqlite');
const templates = new nunJucks.Environment(new nunJucks.FileSystemLoader(path.join(__dirname, 'templates')));

server.register(staticFiles, {root: path.join(__dirname, '../dist')});
server.register(cookie, {secret: cookieSecret});
server.register(formBody);

server.get('/', async (request, response) => {
	await response.send('AF');
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