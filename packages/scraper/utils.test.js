import { describe, it, expect } from 'vitest';

import { slugifyName } from './utils';

describe('slugifyName', () => {
	it('should slugify a name', () => {
		expect(slugifyName('Hello World')).toBe('hello-world');
	});

	it('should remove non-alphanumeric characters', () => {
		expect(slugifyName('Hello World!')).toBe('hello-world');

		expect(slugifyName('Hello+ World!&%#$*@#)($')).toBe('hello-world');
		expect(slugifyName('Hello+World')).toBe('helloworld');
	});
});
