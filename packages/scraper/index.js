import parser from 'yargs-parser';
import fuzzysort from 'fuzzysort';
import fs from 'node:fs';
import scrapers from './scrapers.js';
import { getDb } from '@app/db/index.js';
import { hotSauces, stores, storeHotSauces } from '@app/db/schema.js';

import 'dotenv/config';

const [, , ...args] = process.argv;
const flags = parser(args, {
	boolean: ['noCache', 'dbInsert']
});

const db = getDb(process.env.DATABASE_URL);

/**
 * @param {string} name
 */
function normalizeName(name) {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9\s]/gi, '')
		.trim();
}

/**
 * @param {string} existingName
 * @param {string} newName
 * @param {number} threshold
 */
function isSimilarName(existingName, newName, threshold = -50) {
	const result = fuzzysort.single(newName, existingName);
	return result ? result.score > threshold : false;
}

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

		console.info('Inserting hot sauce data');
		const existingSauceNames = await db
			.select({ id: hotSauces.sauceId, name: hotSauces.name })
			.from(hotSauces);

		const dedupedSauces = data.filter((sauce) => {
			const normalizedNewName = normalizeName(sauce.name);

			return !existingSauceNames.some((existing) =>
				isSimilarName(normalizeName(existing.name), normalizedNewName)
			);
		});
		console.info('Deduped', data.length - dedupedSauces.length, 'sauces');

		if (dedupedSauces.length > 0) {
			const sauces = await db
				.insert(hotSauces)
				.values(dedupedSauces)
				.onConflictDoNothing()
				.returning({ sauceId: hotSauces.sauceId, name: hotSauces.name });
			console.info(`Inserted ${dedupedSauces.length} hot sauces`);
		}

		console.info('Inserting store hot sauce data');
		for (const sauce of data) {
			const s = existingSauceNames.find((s) => isSimilarName(s.name, sauce.name));
			if (!s) {
				console.error('Sauce not found', sauce.name);
				continue;
			}

			await db
				.insert(storeHotSauces)
				.values({
					sauceId: s.id,
					storeId: store[0].storeId,
					url: sauce.url
				})
				.onConflictDoUpdate({
					target: [storeHotSauces.sauceId, storeHotSauces.storeId],
					set: {
						url: sauce.url
					}
				});
		}
	}

	console.info('Writing to data.json');
	fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

	console.info('done in', Math.round(performance.now() - startTime), 'ms');
	process.exit(0);
}

main();
