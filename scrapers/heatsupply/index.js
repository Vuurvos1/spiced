import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import puppeteer from 'puppeteer-extra';

import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const url = 'https://heatsupply.nl';

let body = '';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage();

const u = `${url}/en/product-categorie/hot-sauces-europe/`;
console.info('Opening', u);

await page.goto(u, {
  waitUntil: 'networkidle2',
});

await page.waitForSelector('.facetwp-pager', {});

body = await page.content();

browser.close();

fs.writeFileSync('tmp.html', body);

const document = new JSDOM(body).window.document;

console.log(document.querySelector('.facetwp-pager .facetwp-page.last'));
const lastPage = document.querySelector(
  '.facetwp-pager .facetwp-page.last'
).textContent;

const pages = [];

for (let i = 1; i <= Number(lastPage); i++) {
  pages.push(`${url}/en/product-categorie/hot-sauces-europe/?_paged=${i}`);
}

console.log('Last page', lastPage, pages);

const sauceUrls = [];

for (const page of pages) {
  console.log('Scraping', page);
  const res = await fetch(page);
  const body = await res.text();

  const document = new JSDOM(body).window.document;
  const productElements = document.querySelectorAll('.products > li > a');

  const links = Array.from(productElements).map((el) => el.href);

  sauceUrls.push(...links);
}

console.log('Found', sauceUrls.length, 'sauces');

fs.writeFileSync('./data.json', JSON.stringify(sauceUrls, null, 2));

for (const u of sauceUrls) {
  console.log('Scraping', u);
  const res = await fetch(u);
  const body = await res.text();

  const document = new JSDOM(body).window.document;
  const name = document.querySelector('h1').textContent.replace(' ', '-');

  // create directory
  if (!fs.existsSync('./sauces')) {
    fs.mkdirSync('./sauces');
  }

  console.info('Writing', name);
  fs.writeFileSync(`./sauces/${name}.html`, body);

  // const document = new JSDOM(body).window.document;

  // const name = document.querySelector('.product_title').textContent;
  // const price = document.querySelector('.price .amount').textContent;
  // const description = document.querySelector('.product_description').textContent;
  // const ingredients = document.querySelector('.product_ingredients').textContent;

  // console.log({ name, price, description, ingredients });
}

// https://heatonist.com/products/torchbearer-sauces-makers-collection-hot-sauces.js

// https://www.heatsupply.nl/en/product-categorie/hot-sauces-europe/?_paged=14
