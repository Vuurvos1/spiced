import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { getCachePath, writeFile } from '../utils.js';

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const baseUrl = 'https://heatsupply.nl';
const cachePath = './cache/heatsupply';

/** @type {import('../').GetSauceUrls} */
async function getSauceUrls(url, options) {
	const { cache } = options;

	if (!cache) {
		fs.rmSync(cachePath, { recursive: true, force: true });
	}

	// get amount of sauce pages
	if (!fs.existsSync(`${cachePath}/saucePage.html`)) {
		const mainPageUrl = `${url}/en/product-categorie/hot-sauces-europe/`;
		const mainPageCachePath = getCachePath('heatsupply', mainPageUrl);

		if (!cache || !fs.existsSync(mainPageCachePath)) {
			const browser = await puppeteer.launch({});
			const page = await browser.newPage();

			await page.goto(mainPageUrl, {
				waitUntil: 'networkidle2'
			});
			await page.waitForSelector('.facetwp-pager', {});

			const body = await page.content();
			writeFile(mainPageCachePath, body);

			browser.close();
		}
	}

	const mainPage = fs.readFileSync(`${cachePath}/saucePage.html`, 'utf8');
	const mainDocument = new JSDOM(mainPage).window.document;
	const lastPage = mainDocument.querySelector('.facetwp-pager .facetwp-page.last')?.textContent;
	const pageCount = Number(lastPage);

	/** @type {string[]} */
	const sauceUrls = [];

	for (let i = 1; i <= pageCount; i++) {
		const pageUrl = `${url}/en/product-categorie/hot-sauces-europe/?_paged=${i}`;
		const pageCachePath = getCachePath('heatsupply', pageUrl);

		if (!cache || !fs.existsSync(pageCachePath)) {
			const page = await fetch(pageUrl);
			const body = await page.text();
			writeFile(pageCachePath, body);
		}

		const page = fs.readFileSync(pageCachePath, 'utf8');
		const document = new JSDOM(page).window.document;

		const productElements = document.querySelectorAll('.products .product');

		for (const el of productElements) {
			const name = el.querySelector('h3')?.textContent?.trim();
			if (!name) continue;

			if (
				name.toLowerCase().endsWith(' pack') ||
				name.toLowerCase().includes('3 pack') ||
				name.toLowerCase().endsWith(' subscription box') ||
				name.toLowerCase().includes('giftset')
			) {
				console.info('Skipping bundle', name);
				continue;
			}

			const link = el.querySelector('a')?.href;
			if (link) sauceUrls.push(link);
		}
	}

	return sauceUrls;
}

/** @type {import('../').ScrapeSauce} */
async function scrapeSauce(url, options) {
	const { cache } = options;
	const cachePath = getCachePath('heatsupply', url);

	if (!cache || !fs.existsSync(cachePath)) {
		const page = await fetch(url);
		const body = await page.text();
		writeFile(cachePath, body);
	}

	const page = fs.readFileSync(cachePath, 'utf8');
	const document = new JSDOM(page).window.document;

	const name = document.querySelector('h1')?.textContent?.trim() ?? '';

	// const maker =
	//   document
	//     .querySelector(
	//       '.woocommerce-product-attributes-item--attribute_pa_merk-hot-sauce td p'
	//     )
	//     ?.textContent.trim() ?? '';

	/** @type {HTMLImageElement | null} */
	const imageEl = document.querySelector('.woocommerce-product-gallery__image img.wp-post-image');

	const descriptionElement = document.querySelector(
		'.woocommerce-product-details__short-description > p'
	);

	return {
		name,
		url,
		description: descriptionElement?.textContent?.trim() ?? '',
		imageUrl: imageEl?.src ?? ''
	};
}

/** @type {import('../').SauceScraper} */
export const scraper = {
	name: 'Heatsupply',
	url: baseUrl,
	description:
		'Do you love hot sauce? Then you are at the right place. Heatsupply has a wide and changing assortment of great hot sauces and other spicyness.',
	getSauceUrls,
	scrapeSauce
};
