import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { haveIBeenPwned, lastLoginMethod, twoFactor } from 'better-auth/plugins';
import { sendEmailVerificationToken } from './email';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	emailAndPassword: {
		enabled: true
	},
	sendVerificationEmail: async ({ user, token }, _request) => {
		void (await sendEmailVerificationToken(user.email, token));
	},
	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		}
	},
	plugins: [
		sveltekitCookies(getRequestEvent),
		lastLoginMethod(),
		// emailOTP({
		// TODO: properly implement and configure
		// }),
		twoFactor(),
		haveIBeenPwned()
	]
});
