import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import puppeteer from 'puppeteer-extra';

import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const baseUrl = 'https://heatsupply.nl';

/** @type {import('../').GetSauceUrls} */
async function getSauceUrls(url, cache) {
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

  // pages and sauces cache

  const document = new JSDOM(body).window.document;

  console.log(document.querySelector('.facetwp-pager .facetwp-page.last'));
  const lastPage = document.querySelector(
    '.facetwp-pager .facetwp-page.last'
  )?.textContent;

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
    /** @type {NodeListOf<HTMLAnchorElement>} */
    const productElements = document.querySelectorAll('.products > li > a');

    const links = Array.from(productElements).map((el) => el.href);

    sauceUrls.push(...links);
  }

  console.log('Found', sauceUrls.length, 'sauces');

  return [];
}

/** @type {import('../').ScrapeSauces} */
async function scrapeSauces(sauceUrls, cache = true) {
  for (const u of sauceUrls) {
    console.log('Scraping', u);
    const res = await fetch(u);
    const body = await res.text();

    const document = new JSDOM(body).window.document;
    const name = document.querySelector('h1')?.textContent?.replace(' ', '-');

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

  // for every file in sauces

  const producs = [];

  const files = fs.readdirSync('./sauces');
  for (const file of files) {
    const body = fs.readFileSync(`./sauces/${file}`, 'utf-8');
    const document = new JSDOM(body).window.document;

    const name = document.querySelector('h1').textContent.trim();
    const description = document
      .querySelector(
        '.summary .woocommerce-product-details__short-description > p'
      )
      .textContent.trim();

    // const name = document.querySelector('h1').textContent.trim();
    // const description =
    //   document
    //     .querySelector('.product__description')
    //     ?.textContent.trim()
    //     .replace(/^"|"$/g, '') || '';
    // if (!description) {
    //   console.warn('No description found for', name);
    // }

    // document.querySelector("#tab-additional_information > table > tbody > tr.woocommerce-product-attributes-item.woocommerce-product-attributes-item--attribute_pa_merk-hot-sauce > td > p")
    // document.querySelector("#tab-additional_information > table > tbody > tr.woocommerce-product-attributes-item.woocommerce-product-attributes-item--attribute_pa_merk-hot-sauce > td > p")

    // const brand = 'T-Rex Hot Sauce';
    const brand =
      document
        .querySelector(
          '.woocommerce-product-attributes-item--attribute_pa_merk-hot-sauce td p'
        )
        ?.textContent.trim() ?? '';

    const img = document.querySelector(
      '.woocommerce-product-gallery__image img.wp-post-image'
    ).src;

    console.info('Scraping', name);

    const sauce = {
      name,
      description,
      brand,
      img,
      // url: u,
    };

    producs.push(sauce);
  }

  console.info('Found', producs.length, 'sauces');
  console.info('Writing to data.json');

  fs.writeFileSync('./data.json', JSON.stringify(producs, null, 2));

  return [];
}

/** @type {import('../').SauceScraper} */
export const scraper = {
  baseUrl,
  name: 'heatsupply',
  getSauceUrls,
  scrapeSauces,
};

// fs.writeFileSync('./data.json', JSON.stringify(sauceUrls, null, 2));
