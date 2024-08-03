// TODO: type from db
export type Sauce = {
  name: string;
  description: string;
  maker: string;
  images: string[];
  url: string;
};

// Could be a class with method chaining?
export type SauceScraper = {
  getSauceUrls: (url: string, cache: boolean) => Promise<string[]>;
  scrapeSauces: (sauceUrls: string[], cache: boolean) => Promise<Sauce[]>;
};
