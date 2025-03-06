const baseUrl = 'https://chilisaus.be/';

/** @type {import('../').GetSauceUrls} */
async function getSauceUrls(url, options) {
	console.warn('TODO: Not implemented');
	return [];
}

/** @type {import('../').ScrapeSauce} */
async function scrapeSauce(url, options) {
	console.warn('TODO: Not implemented');
	return null;
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
	scrapeSauce
};
