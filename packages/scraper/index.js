import parser from 'yargs-parser';
import fs from 'node:fs';
import scrapers from './scrapers.js';
import { getDb } from '@app/db/index.js';
import { hotSauces, stores, storeHotSauces } from '@app/db/schema.js';

const [, , ...args] = process.argv;
const flags = parser(args, {
	boolean: ['noCache', 'dbInsert']
});

const db = getDb(process.env.DATABASE_URL);

async function main() {
	const startTime = performance.now();
	const command = flags['_'].shift();

	if (!command) {
		console.error('No command provided');
		process.exit(1);
	}

	const scraper = scrapers[command.toString().toLowerCase()];

	if (!scraper) {
		console.error('No scraper found for', command);
		process.exit(1);
	}

	const cache = !flags.noCache;

	console.info(`Running scraper - ${scraper.name} - ${scraper.url}`);
	const data = await scraper.scrapeSauces(await scraper.getSauceUrls(scraper.url, cache), cache);

	console.info('Found', data.length, 'sauces');
	// TODO: implement fast-levenshtein to find duplicates

	if (flags.dbInsert) {
		// upsert store data
		console.info('Upserting store data');
		const store = await db
			.insert(stores)
			.values({
				name: scraper.name,
				url: scraper.url
			})
			.onConflictDoUpdate({
				target: stores.name,
				set: {
					url: scraper.url
				}
			})
			.returning();

		// TODO: deduping step
		console.info('Inserting hot sauce data');
		const sauces = await db
			.insert(hotSauces)
			.values(data)
			.returning({ id: hotSauces.id, name: hotSauces.name });

		console.info('Inserting store hot sauce data');
		await db.insert(storeHotSauces).values(
			sauces.map((sauce) => ({
				hotSauceId: sauce.id,
				storeId: store[0].storeId,
				url: `${scraper.url}/${sauce.name}`
			}))
		);
	}

	console.info('Writing to data.json');
	fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

	console.info('done in', Math.round(performance.now() - startTime), 'ms');
	process.exit(0);
}

main();
