import { JSDOM } from 'jsdom';
import fs from 'node:fs';

const baseUrl = 'https://heatonist.com';

/** @type {import('../').GetSauceUrls} */
async function getSauceUrls(url, cache = true) {
	console.warn('TODO: Not implemented');
	return [];
}

/** @type {import('../').ScrapeSauces} */
async function scrapeSauces(sauceUrls, cache = true) {
	console.warn('TODO: Not implemented');
	return [];
}

/** @type {import('../').SauceScraper} */
export const scraper = {
	name: 'Heatonist',
	url: baseUrl,
	description:
		'Shop top rated hot sauce, from the official Hot Ones hot sauces to our own flavorful creations and collabs with the best hot sauce makers!',
	getSauceUrls,
	scrapeSauces
};
