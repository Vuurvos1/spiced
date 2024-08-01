import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite', // postgres
	schema: './src/lib/db/schema.ts',
	out: './migrations',
	dbCredentials: {
		url: process.env.DATABASE_URL
	}
});
