import { scraper as trex } from './trexhotsauce/index.js';
import { scraper as heatsupply } from './heatsupply/index.js';

/** @type {Record<string, import('./').SauceScraper>} */
export default {
  trex,
  heatsupply,
};
