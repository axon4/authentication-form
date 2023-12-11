import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';
import FastifyPlugIn from 'fastify-plugin';

export const flashMessageCookieKey = 'flashMessage';

const callBack: FastifyPluginCallback = function (fastify, _options, next) {
	fastify.addHook('onRequest', async (_request: FastifyRequest, response: FastifyReply) => {
		response.setCookie(flashMessageCookieKey, '', {path: '/'});
	});

	next();
};

export const clearFlashMessageCookie = FastifyPlugIn(callBack);