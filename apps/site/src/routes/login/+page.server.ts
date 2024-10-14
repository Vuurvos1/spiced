import { hashSettings } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import { verify } from '@node-rs/argon2';
import type { Actions, PageServerLoad } from './$types';
import { checkIfUserExists } from '$lib/server/auth';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (
			typeof email !== 'string' ||
			email.length < 3 ||
			email.length > 255 ||
			!email.includes('@') ||
			!email.includes('.')
		) {
			return fail(400, {
				message: 'Invalid email'
			});
		}

		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		const existingUser = await checkIfUserExists(email);

		if (existingUser && existingUser.isEmailVerified === false) {
			return fail(400, {
				message: 'You must verify your email before logging in.'
			});
		}

		if (
			!existingUser ||
			!existingUser.passwordHash ||
			!existingUser.authMethods.includes('email')
		) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const validPassword = await verify(existingUser.passwordHash, password, hashSettings);
		if (!validPassword) {
			// NOTE:
			// Returning immediately allows malicious actors to figure out valid usernames from response times,
			// allowing them to only focus on guessing passwords in brute-force attacks.
			// As a preventive measure, you may want to hash passwords even for invalid usernames.
			// However, valid usernames can be already be revealed with the signup page among other methods.
			// It will also be much more resource intensive.
			// Since protecting against this is non-trivial,
			// it is crucial your implementation is protected against brute-force attacks with login throttling, 2FA, etc.
			// If usernames are public, you can outright tell the user that the username is invalid.
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const token = generateSessionToken();
		const session = await createSession(token, existingUser.id);
		setSessionTokenCookie(event.cookies, token, session.expiresAt);

		return redirect(302, '/');
	}
};
