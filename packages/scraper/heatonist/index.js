import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import { createDir } from '../utils.js';

const baseUrl = 'https://heatonist.com';
const cachePath = './cache/heatonist';

/**
 * @param {Document} document
 * @returns {string[]}
 */
function getProductUrls(document) {
	/** @type {string[]} */
	const urls = [];

	/** @type {NodeListOf<HTMLDivElement>} */
	const productsElements = document.querySelectorAll('.product');
	for (const product of productsElements) {
		const title = product.getAttribute('data-title');
		if (!title) continue;

		const lowerTitle = title.toLowerCase();

		if (lowerTitle.match(/\b(pack|trio|duo)\b/)) continue;

		/** @type {HTMLAnchorElement | null} */
		const anchor = product.querySelector('a:first-child');
		if (!anchor) continue;

		urls.push(baseUrl + anchor.href);
	}

	return urls;
}

/** @type {import('../').GetSauceUrls} */
async function getSauceUrls(url, cache = true) {
	if (!cache) {
		fs.rmSync(cachePath, { recursive: true, force: true });
	}

	createDir(cachePath);

	const mainPage = await fetch(`${baseUrl}/collections/all-hot-sauces`);
	const body = await mainPage.text();

	// write to file
	fs.writeFileSync(`${cachePath}/mainPage.html`, body);

	const document = new JSDOM(body).window.document;

	// get counts from .pagination-message
	const paginationMessage = document.querySelector('.pagination-message');
	const numbers = paginationMessage?.textContent?.match(/\d+/g);
	const pageCount = parseInt(numbers?.[0] ?? '0');
	const totalProducts = parseInt(numbers?.[1] ?? '0');

	const totalPages = Math.ceil(totalProducts / pageCount);

	/** @type {string[]} */
	const sauceUrls = getProductUrls(document);

	for (let i = 2; i <= totalPages; i++) {
		const page = await fetch(`${baseUrl}/collections/all-hot-sauces?page=${i}`);
		const body = await page.text();

		fs.writeFileSync(`${cachePath}/page${i}.html`, body);

		const document = new JSDOM(body).window.document;

		sauceUrls.push(...getProductUrls(document));
	}

	return sauceUrls;
}

// TODO: turn into single sauce scrape, and move loop logic to index
// TODO: change param to options instead of just cache
/** @type {import('../').ScrapeSauces} */
async function scrapeSauces(sauceUrls, cache = true) {
	console.info('urls', sauceUrls);

	/** @type {import('../').Sauce[]} */
	const sauces = [];

	for (const url of sauceUrls) {
		const page = await fetch(url);
		const body = await page.text();

		const document = new JSDOM(body).window.document;

		const name = document.querySelector('h1')?.textContent?.trim() ?? '';

		/** @type {HTMLImageElement | null} */
		const imageElement = document.querySelector('.product-image img');
		const descriptionElement = document.querySelector('#info-wrap .reveal-content p');

		sauces.push({
			name,
			description: descriptionElement?.textContent?.trim() ?? '',
			url,
			imageUrl: imageElement?.src ?? ''
		});
	}

	return sauces;
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
