const baseUrl = 'https://chilisaus.be/';

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
	name: 'Chilisaus.be',
	url: baseUrl,
	description: `We work with the Best Producers, to bring you The Best Chili Products
 Only products with Top Quality Ingredients pass the Chilisaus.be Acceptance Test
NEVER Products with Additives, Artificial Flavours or Colours
You will NOT find our Products in ANY Supermarkets!`,
	getSauceUrls,
	scrapeSauces
};
