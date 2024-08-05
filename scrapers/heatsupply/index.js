import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import puppeteer from 'puppeteer-extra';

import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { createDir } from '../utils.js';

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const baseUrl = 'https://heatsupply.nl';
const cachePath = './cache/heatsupply';

/** @type {import('../').GetSauceUrls} */
async function getSauceUrls(url, cache) {
  if (!cache || !fs.existsSync(`${cachePath}/saucePage.html`)) {
    createDir(cachePath);

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

    const body = await page.content();

    browser.close();

    console.log('Fetching');

    fs.writeFileSync(`${cachePath}/saucePage.html`, body);
  }

  // pages and sauces cache

  if (!cache || !fs.existsSync(`${cachePath}/saucePages`)) {
    createDir(`${cachePath}/saucePages`);

    const body = fs.readFileSync(`${cachePath}/saucePage.html`, 'utf8');
    const document = new JSDOM(body).window.document;

    const lastPage = document.querySelector(
      '.facetwp-pager .facetwp-page.last'
    )?.textContent;

    for (let i = 1; i <= Number(lastPage); i++) {
      const res = await fetch(
        `${url}/en/product-categorie/hot-sauces-europe/?_paged=${i}`
      );
      const body = await res.text();

      fs.writeFileSync(`${cachePath}/saucePages/${i}.html`, body);

      // pages.push(`${url}/en/product-categorie/hot-sauces-europe/?_paged=${i}`);
    }

    console.log('Last page', lastPage);
  }

  const saucePages = fs.readdirSync(`${cachePath}/saucePages`);

  /** @type {string[]} */
  const sauceUrls = [];
  for (const file of saucePages) {
    const body = fs.readFileSync(`${cachePath}/saucePages/${file}`, 'utf8');
    const document = new JSDOM(body).window.document;

    /** @type {NodeListOf<HTMLAnchorElement>} */
    const productElements = document.querySelectorAll('.products > li > a');

    const links = Array.from(productElements).map((el) => el.href);

    sauceUrls.push(...links);
  }

  return sauceUrls;
}

/** @type {import('../').ScrapeSauces} */
async function scrapeSauces(sauceUrls, cache = true) {
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

  /** @type {import('../').Sauce[]} */
  const sauces = [];

  const files = fs.readdirSync(`${cachePath}/sauces`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (i % 10 === 0) console.info('Scraping', i, 'of', files.length);

    const body = fs.readFileSync(`${cachePath}/sauces/${file}`, 'utf8');
    const document = new JSDOM(body).window.document;

    const name = document.querySelector('h1')?.textContent?.trim() ?? '';

    if (
      document.querySelector('form.bundle_form') ||
      name.toLowerCase().endsWith(' pack') ||
      name.toLowerCase().includes('3 pack') ||
      name.toLowerCase().endsWith(' subscription box') ||
      name.toLowerCase().includes('giftset')
    ) {
      console.info('Skipping bundle', name);
      continue;
    }

    const description =
      document
        .querySelector(
          '.summary .woocommerce-product-details__short-description > p'
        )
        ?.textContent?.trim() ?? '';

    // const brand =
    //   document
    //     .querySelector(
    //       '.woocommerce-product-attributes-item--attribute_pa_merk-hot-sauce td p'
    //     )
    //     ?.textContent.trim() ?? '';

    /** @type {HTMLImageElement | null} */
    const imageEl = document.querySelector(
      '.woocommerce-product-gallery__image img.wp-post-image'
    );

    sauces.push({
      name,
      description,
      imageUrl: imageEl?.src ?? '',
    });
  }

  return sauces;
}

/** @type {import('../').SauceScraper} */
export const scraper = {
  baseUrl,
  name: 'heatsupply',
  getSauceUrls,
  scrapeSauces,
};
