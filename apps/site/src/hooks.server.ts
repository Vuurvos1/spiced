import type { Handle } from '@sveltejs/kit';
import {
	deleteSessionTokenCookie,
	setSessionTokenCookie,
	validateSessionToken
} from '$lib/server/session';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	if (!token) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session) {
		setSessionTokenCookie(event.cookies, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event.cookies);
	}

	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};
