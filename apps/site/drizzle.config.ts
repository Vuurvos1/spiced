import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/db/schema.ts',
	out: './drizzle',
	dbCredentials: {
		// @ts-expect-error - process.env is available at runtime
		url: process.env.DATABASE_URL
	}
});
