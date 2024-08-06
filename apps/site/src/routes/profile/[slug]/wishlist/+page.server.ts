import { db } from '$lib/db';
import { hotSauces, wishlist } from '@app/db/schema';
// import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
	const userId = params.slug;

	// TODO: fix query
	const dbRes = await db
		.select()
		.from(wishlist)
		.where(eq(wishlist.userId, userId))
		.innerJoin(hotSauces, eq(wishlist.hotSauceId, hotSauces.id));

	// dbRes[0].hot_sauces

	console.info(dbRes);
	// const sauceId = Number(params.slug);

	// const dbSauce = await db.select().from(hotSauces).where(eq(hotSauces.id, sauceId)).limit(1);

	// if (dbSauce.length === 0) {
	// 	error(404, 'Sauce not found');
	// }

	// const sauce = dbSauce[0];

	// const dbReviews = await db
	// 	.select({
	// 		username: userTable.username,
	// 		review: reviews
	// 	})
	// 	.from(reviews)
	// 	.leftJoin(userTable, eq(reviews.userId, userTable.id))
	// 	.where(eq(reviews.hotSauceId, sauceId));

	// const sauces = dbRes[0].hot_sauces;

	return { sauces: [] };
}
