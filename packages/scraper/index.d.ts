import type { HotSauceInsert, StoreInsert } from '@app/db/types';

export type Sauce = HotSauceInsert & { url: string };

export type GetSauceUrls = (url: string, cache: boolean) => Promise<string[]>;
export type ScrapeSauces = (sauceUrls: string[], cache: boolean) => Promise<Sauce[]>;

// Could be a class with method chaining?
export type SauceScraper = StoreInsert & {
	getSauceUrls: GetSauceUrls;
	scrapeSauces: ScrapeSauces;
};

export type Maker = {
	name: string;
	description?: string;
	url?: string;
	logoUrl?: string;
};

// TODO: depricate
// TODO: add logoUrl
export type Store = {
	name: string;
	description?: string;
	url?: string;
	logoUrl?: string;
};
