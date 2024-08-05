import { db } from '$lib/db';
import { hotSauces } from '@app/db/schema';
import { count, desc } from 'drizzle-orm';

export async function load({ url }) {
	const page = Number(url.searchParams.get('page')) || 1;
	const pageSize = 24;

	const sauceCount = await db.select({ count: count() }).from(hotSauces);
	const sauces = await db
		.select()
		.from(hotSauces)
		.orderBy(desc(hotSauces.createdAt))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	return { sauces, sauceCount: sauceCount[0].count, pageSize };
}
