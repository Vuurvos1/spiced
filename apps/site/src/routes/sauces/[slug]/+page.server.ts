import { db } from '$lib/db';
import { hotSauces, reviews, userTable, wishlist } from '@app/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, eq, or } from 'drizzle-orm';

// @ts-expect-error - missing types
import * as toxicity from '@tensorflow-models/toxicity';

export async function load({ params, locals: { user } }) {
	const sauceId = Number(params.slug);

	const dbSauce = await db.select().from(hotSauces).where(eq(hotSauces.id, sauceId)).limit(1);

	if (dbSauce.length === 0) {
		error(404, 'Sauce not found');
	}

	const sauce = dbSauce[0];

	// querry all reviews for a sauce, that are not flagged or are from the user
	const dbReviews = await db
		.select({
			username: userTable.username,
			review: reviews
		})
		.from(reviews)
		.leftJoin(userTable, eq(reviews.userId, userTable.id))
		.where(
			and(
				eq(reviews.hotSauceId, sauceId),
				or(eq(reviews.flagged, false), eq(reviews.userId, user?.id ?? ''))
			)
		);

	return { sauce, reviews: dbReviews };
}

export const actions = {
	review: async ({ request, params, locals: { session, user } }) => {
		if (!session || !user) {
			return fail(401, {
				success: false,
				error: 'Unauthorized'
			});
		}

		const sauceId = Number(params.slug);

		if (!sauceId) {
			return fail(400, {
				success: false,
				error: 'Invalid sauce'
			});
		}

		// return fail(500, {
		// 	success: false,
		// 	error: 'Reviewing is disabled'
		// });

		const modelPromise = toxicity.load(0.9, ['toxicity']);

		const data = await request.formData();

		const rating = Number(data.get('rating'));

		if (rating < 1 || rating > 5) {
			return fail(400, {
				success: false,
				error: 'Invalid rating'
			});
		}

		const reviewText = String(data.get('content'));

		console.time('toxicity');
		let flagged = false;
		// this takes 4-5 seconds
		if (reviewText) {
			const model = await modelPromise;

			const predictions = await model.classify(reviewText);

			for (const prediction of predictions) {
				if (prediction.results[0].match) {
					flagged = true;
					break;
				}
			}
		}
		console.timeEnd('toxicity');

		try {
			await db
				.insert(reviews)
				.values([
					{
						hotSauceId: sauceId,
						reviewText,
						userId: user.id,
						rating,
						flagged
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
			return fail(500, {
				success: false,
				error: 'Failed to save review'
			});
		}

		return { success: true };
	},
	addWishlist: async ({ params, locals: { session, user } }) => {
		if (!session || !user) {
			// redirect(302, '/signup');
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
