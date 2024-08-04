import { db } from '$lib/db';
import { userTable } from '@app/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
	const { slug } = params;

	try {
		const users = await db.select().from(userTable).where(eq(userTable.username, slug)).limit(1);

		if (users.length === 0) {
			error(404, 'User not found');
		}

		const user = users[0];

		return {
			user: {
				username: user.username
			}
		};
	} catch (err) {
		console.error(err);
		error(500, 'Internal server error');
	}
}
