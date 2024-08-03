import { JSDOM } from 'jsdom';
import fs from 'node:fs';

const url = 'https://t-rexhotsauce.com';

console.log('Scraping', url);

let body = '';

if (!fs.existsSync('tmp.html')) {
  console.log('Fetching');
  const res = await fetch(`${url}/collections/all`);
  const body = await res.text();

  fs.writeFileSync('trexhotsauce.html', body);
} else {
  console.log('Reading from file');
  body = fs.readFileSync('tmp.html', 'utf8');
}

const document = new JSDOM(body).window.document;
const productElements = document.querySelectorAll(
  '#product-grid .grid__item .card > .card__content a'
);

const links = Array.from(productElements).map((el) => el.href);

/**
 * @type {Array<{ name: string, description: string, brand: string, price: number, currency: string, img: string, url: string }>}
 */
const producs = [];

for (const link of links) {
  const u = `${url}${link}`;
  console.info('Scraping sauce', u);
  const res = await fetch(u);
  const body = await res.text();
  // const body = fs.readFileSync('trexhotsauce.html', 'utf8');
  // fs.writeFileSync('./trexhotsauce.html', body);

  const document = new JSDOM(body).window.document;
  const name = document.querySelector('h1').textContent.trim();
  const description =
    document
      .querySelector('.product__description')
      ?.textContent.trim()
      .replace(/^"|"$/g, '') || '';
  if (!description) {
    console.warn('No description found for', name);
  }

  const currency = 'EUR';
  const price = (
    Number(
      document
        .querySelector('.price-item')
        .textContent.trim()
        .replace(/[^0-9.]/g, '')
    ) / 100
  ).toFixed(2);

  const brand = 'T-Rex Hot Sauce';
  const img = 'https:' + document.querySelector('.product__media img').src; // TODO: maybe get all images

  const sauce = {
    name,
    description,
    currency,
    price,
    brand,
    img,
    url: u,
  };

  producs.push(sauce);
}

console.info('Found', producs.length, 'sauces');
console.info('Writing to data.json');

fs.writeFileSync('./data.json', JSON.stringify(producs, null, 2));
