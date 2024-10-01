import { db } from '$lib/db';
import { checkins, hotSauces, userTable } from '@app/db/schema';
import { error } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';

export async function load({ params }) {
	const { slug } = params;

	try {
		const users = await db.select().from(userTable).where(eq(userTable.username, slug)).limit(1);

		if (users.length === 0) {
			error(404, 'User not found');
		}

		const user = users[0];

		const checkedSauces = await db
			.select({
				hotSauce: hotSauces
			})
			.from(checkins)
			.leftJoin(hotSauces, eq(checkins.hotSauceId, hotSauces.id))
			.orderBy(desc(checkins.createdAt))
			.limit(12);

		return {
			user: {
				id: user.id,
				username: user.username
			},
			checkedSauces: checkedSauces.map((s) => s.hotSauce).filter((s) => !!s)
		};
	} catch (err) {
		console.error(err);
		error(500, 'Internal server error');
	}
}
