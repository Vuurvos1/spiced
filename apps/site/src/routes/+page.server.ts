import { lucia } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { deleteSessionCookie } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/sauces'); // TODO: maybe change when I have thought of a way to structure the routes
		// return redirect(302, '/login'); // or to some type of home page that shows timeline
	}
	return {
		user: event.locals.user
	};
};

export const actions: Actions = {
	logout: async ({ locals, cookies }) => {
		if (!locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(locals.session.id);

		deleteSessionCookie(lucia, cookies);

		return redirect(302, '/login');
	}
};
