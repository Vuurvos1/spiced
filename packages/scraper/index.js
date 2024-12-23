import parser from 'yargs-parser';
import fs from 'node:fs';
import scrapers from './scrapers.js';
import { getDb } from '@app/db/index.js';
import { hotSauces } from '@app/db/schema.js';

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
		console.info('Inserting into db');
		await db.insert(hotSauces).values(data);
	}

	// TODO: deduping step

	console.info('Writing to data.json');
	fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

	console.info('done in', performance.now() - startTime, 'ms');
	process.exit(0);
}

main();
