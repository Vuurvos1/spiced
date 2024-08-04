import type { HotSauceInsert } from '@app/db/types';

export type Sauce = HotSauceInsert;

export type GetSauceUrls = (url: string, cache: boolean) => Promise<string[]>;
export type ScrapeSauces = (
  sauceUrls: string[],
  cache: boolean
) => Promise<HotSauceInsert[]>;

// Could be a class with method chaining?
export type SauceScraper = {
  baseUrl: string;
  name: string;
  getSauceUrls: GetSauceUrls;
  scrapeSauces: ScrapeSauces;
};
