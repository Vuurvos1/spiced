import { db } from '$lib/db';
import { checkins, hotSauces, userTable, wishlist } from '@app/db/schema';
import { error, fail } from '@sveltejs/kit';
import { and, eq, not } from 'drizzle-orm';

// TODO: fix tensorflow issues
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as tf from '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';

export async function load({ params, locals: { user } }) {
	const sauceId = Number(params.slug);

	const dbSauce = await db.select().from(hotSauces).where(eq(hotSauces.id, sauceId)).limit(1);

	if (dbSauce.length === 0) {
		error(404, 'Sauce not found');
	}

	const sauce = dbSauce[0];

	// querry all reviews for a sauce, that are not flagged or are from the user
	const dbCheckins = await db
		.select({
			username: userTable.username,
			checkins: checkins
		})
		.from(checkins)
		.leftJoin(userTable, eq(checkins.userId, userTable.id))
		.where(
			and(
				eq(checkins.hotSauceId, sauceId),
				eq(checkins.flagged, false),
				user ? not(eq(userTable.id, user.id)) : undefined
			)
		)
		.limit(24);

	if (user) {
		const dbUserCheckinPromise = db
			.select()
			.from(checkins)
			.where(and(eq(checkins.hotSauceId, sauceId), eq(checkins.userId, user.id)));

		const dbWishlistPromise = db
			.select({})
			.from(wishlist)
			.where(and(eq(wishlist.hotSauceId, sauceId), eq(wishlist.userId, user.id)));

		const [userCheckin, dbWishlist] = await Promise.all([dbUserCheckinPromise, dbWishlistPromise]);

		return {
			sauce,
			checkins: dbCheckins,
			userCheckin: userCheckin.length > 0 ? userCheckin[0] : null,
			wishlisted: dbWishlist.length > 0
		};
	}

	return {
		sauce,
		checkins: dbCheckins,
		userCheckin: null,
		wishlisted: false
	};
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

		const data = await request.formData();

		const rating = Number(data.get('rating'));

		if (rating < 1 || rating > 5) {
			return fail(400, {
				success: false,
				error: 'Invalid rating'
			});
		}

		const review = String(data.get('content'));

		let flagged = false;
		// this takes 4-5 seconds
		if (review) {
			const model = await toxicity.load(0.9, ['toxicity']);

			const predictions = await model.classify(review);

			for (const prediction of predictions) {
				if (prediction.results[0].match) {
					flagged = true;
					break;
				}
			}
		}

		try {
			await db
				.insert(checkins)
				.values([
					{
						hotSauceId: sauceId,
						review,
						userId: user.id,
						rating,
						flagged
					}
				])
				.onConflictDoUpdate({
					target: [checkins.userId, checkins.hotSauceId],
					set: {
						review,
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
	wishlist: async ({ params, request, locals: { session, user } }) => {
		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const sauceId = Number(params.slug);

		if (!sauceId) {
			return fail(400, { error: 'Invalid sauce' });
		}

		const data = await request.formData();
		const wish = data.get('wishlist');

		if (wish === 'false') {
			try {
				await db
					.delete(wishlist)
					.where(and(eq(wishlist.hotSauceId, sauceId), eq(wishlist.userId, user.id)));
			} catch (err) {
				console.error(err);
				return fail(500, { error: 'Failed to remove from wishlist' });
			}

			return { success: true };
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
