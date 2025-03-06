import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import { createDir } from '../utils.js';

const baseUrl = 'https://t-rexhotsauce.com';
const cachePath = './cache/trex';

/** @type {import('../').GetSauceUrls} */
async function getSauceUrls(url, options) {
	const { cache } = options;

	if (!cache) {
		fs.rmSync(cachePath, { recursive: true, force: true });
	}

	if (!fs.existsSync(`${cachePath}/saucePage.html`)) {
		createDir(cachePath);

		console.log('Fetching');
		const res = await fetch(`${url}/collections/all`);
		const body = await res.text();
		fs.writeFileSync(`${cachePath}/saucePage.html`, body);
	}

	const body = fs.readFileSync(`${cachePath}/saucePage.html`, 'utf8');

	const document = new JSDOM(body).window.document;

	/** @type {NodeListOf<HTMLAnchorElement>} */
	const productElements = document.querySelectorAll(
		'#product-grid .grid__item .card > .card__content a'
	);

	const links = Array.from(productElements).map((el) => `${url}${el.href}`);

	return links;
}

/** @type {import('../').ScrapeSauce} */
async function scrapeSauce(sauceUrls, options) {
	const { cache } = options;

	/**
	 * @type {import('../').Sauce[]}}
	 */
	const producs = [];

	if (!cache || !fs.existsSync(`${cachePath}/sauces`)) {
		createDir(`${cachePath}/sauces`);

		for (const link of sauceUrls) {
			console.info('Scraping sauce', link);
			const res = await fetch(link);
			const body = await res.text();

			const fileName = `${cachePath}/sauces/${link.replace('https://', '').replace(/\//g, '_')}.html`;
			fs.writeFileSync(fileName, body);
		}
	}

	const files = fs.readdirSync(`${cachePath}/sauces`);
	for (const file of files) {
		const body = fs.readFileSync(`${cachePath}/sauces/${file}`, 'utf8');

		const document = new JSDOM(body).window.document;
		const name = document.querySelector('h1')?.textContent?.trim() ?? '';
		const description =
			document.querySelector('.product__description')?.textContent?.trim().replace(/^"|"$/g, '') ||
			'';
		if (!description) {
			console.warn('No description found for', name);
		}

		/** @type {HTMLImageElement | null} */
		const img = document.querySelector('.product__media img'); // TODO: maybe get all images

		const url = document.querySelector('link[rel="canonical"]')?.getAttribute('href');

		/** @type {import('../').Sauce}} */
		const sauce = {
			name,
			description,
			url: url ?? '',
			imageUrl: img ? `https:${img.src}` : null
			// brand,
		};

		producs.push(sauce);
	}

	return null;
}

/** @type {import('../').SauceScraper} */
export const scraper = {
	name: 'T-Rex Hot Sauce',
	url: baseUrl,
	description:
		'T-rex Hot sauce is a Amsterdam based hot sauce brand. From our own little kitchen we make small batches of vegan and fermented hot sauce.',
	getSauceUrls,
	scrapeSauce
};
