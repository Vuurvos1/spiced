import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { dev } from '$app/environment';
import { db } from '$lib/db';
import { sessionTable, userTable } from '@app/db/schema';
import type { DatabaseUser } from '@app/db/types';
import { Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';
import type { Options as HashOptions } from '@node-rs/argon2';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			email: attributes.email,
			emailVerified: attributes.emailVerified,
			authMethods: attributes.authMethods
		};
	}
});

export const GOOGLE_OAUTH_STATE_COOKIE_NAME = 'googleOauthState';
export const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME = 'googleOauthCodeVerifier';

export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	PUBLIC_BASE_URL + '/login/google/callback'
);

export const hashSettings: HashOptions = {
	// recommended minimum parameters
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<DatabaseUser, 'id' | 'passwordHash'>;
	}
}
