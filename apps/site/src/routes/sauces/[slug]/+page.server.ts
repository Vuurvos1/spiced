import { db } from '$lib/db';
import { hotSauces, reviews, userTable, wishlist } from '@app/db/schema';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
	const sauceId = Number(params.slug);

	const dbSauce = await db.select().from(hotSauces).where(eq(hotSauces.id, sauceId)).limit(1);

	if (dbSauce.length === 0) {
		error(404, 'Sauce not found');
	}

	const sauce = dbSauce[0];

	const dbReviews = await db
		.select({
			username: userTable.username,
			review: reviews
		})
		.from(reviews)
		.leftJoin(userTable, eq(reviews.userId, userTable.id))
		.where(eq(reviews.hotSauceId, sauceId));

	return { sauce, reviews: dbReviews };
}

export const actions = {
	review: async ({ request, params, locals: { session, user } }) => {
		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const sauceId = Number(params.slug);

		if (!sauceId) {
			return fail(400, { error: 'Invalid sauce' });
		}

		const data = await request.formData();

		const rating = Number(data.get('rating'));

		if (rating < 1 || rating > 5) {
			return fail(400, { error: 'Invalid rating' });
		}

		const reviewText = String(data.get('content'));

		try {
			await db
				.insert(reviews)
				.values([
					{
						hotSauceId: sauceId,
						reviewText,
						userId: user.id,
						rating
					}
				])
				.onConflictDoUpdate({
					target: [reviews.userId, reviews.hotSauceId],
					set: {
						reviewText,
						rating
					}
				});
		} catch (err) {
			console.error(err);
			return fail(500, { error: 'Failed to save review' });
		}

		return { success: true };
	},
	addWishlist: async ({ params, locals: { session, user } }) => {
		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const sauceId = Number(params.slug);

		if (!sauceId) {
			return fail(400, { error: 'Invalid sauce' });
		}

		try {
			await db.insert(wishlist).values([
				{
					hotSauceId: sauceId,
					userId: user.id
				}
			]);
		} catch (err) {
			console.error(err);
			return fail(500, { error: 'Failed to add to wishlist' });
		}

		return { success: true };
	}
};
