import parser from 'yargs-parser';
import fs from 'node:fs';
import scrapers from './scrapers.js';

const [, , ...args] = process.argv;
const flags = parser(args, {
  boolean: ['noCache'],
});

async function main() {
  const command = flags['_'].shift();

  if (!command) {
    console.error('No command provided');
    process.exit(1);
  }

  const scraper = scrapers[command];

  if (!scraper) {
    console.error('No scraper found for', command);
    process.exit(1);
  }

  const cache = !flags.noCache;

  console.info('Running scraper', scraper);
  const data = await scraper.scrapeSauces(
    await scraper.getSauceUrls(scraper.baseUrl, cache),
    cache
  );

  // command.get

  // get pages
  // get sauce urls
  // get sauce data
  // functions should pass into eachother
  // add caching step where sauces are save to disk unless told to remove cache (yeet cache folder?)
  // deduping step

  console.info('Writing to data.json');
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
}

main();
