import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

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

		if (typeof email !== 'string' || !email.includes('@')) {
			return fail(400, { message: 'Invalid email' });
		}

		if (typeof password !== 'string' || password.length < 6) {
			return fail(400, { message: 'Invalid password' });
		}

		try {
			await auth.api.signInEmail({
				body: { email, password },
				headers: event.request.headers
			});
		} catch (err) {
			if (err instanceof APIError) {
				if (err.body?.code === 'EMAIL_NOT_VERIFIED') {
					return fail(400, { message: 'You must verify your email before logging in.' });
				}
				return fail(400, { message: err.body?.message ?? 'Incorrect email or password' });
			}
			console.error('Login error:', err);
			return fail(500, { message: 'An unexpected error occurred.' });
		}

		return redirect(302, '/');
	}
};
