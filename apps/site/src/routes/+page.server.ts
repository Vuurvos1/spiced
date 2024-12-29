import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/session';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/sauces'); // TODO: maybe change when I have thought of a way to structure the routes
		// return redirect(302, '/login'); // or to some type of home page that shows timeline
	}
};

export const actions: Actions = {
	logout: async ({ locals, cookies }) => {
		if (!locals.session) {
			return fail(401);
		}
		await invalidateSession(locals.session.id);

		deleteSessionTokenCookie(cookies);

		return redirect(302, '/login');
	},
	search: async ({ request, url }) => {
		const formData = await request.formData();
		const search: string = (formData.get('search') as string) ?? '';

		url.pathname = '/sauces';
		if (search) url.searchParams.set('search', search);
		url.searchParams.delete('/search'); // Remove the search action from the URL
		console.log('url', url.toString());

		return redirect(303, url.toString());
	}
};
