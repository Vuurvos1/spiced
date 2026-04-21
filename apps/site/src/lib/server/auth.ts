import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '$lib/server/db';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { haveIBeenPwned, lastLoginMethod } from 'better-auth/plugins';
import { sendEmailVerificationEmail, sendPasswordResetEmail } from './email';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	user: {
		additionalFields: {
			username: {
				type: 'string',
				required: true,
				unique: true,
				input: true
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await sendPasswordResetEmail(user.email, url);
		}
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmailVerificationEmail(user.email, url);
		}
	},
	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		}
	},
	plugins: [sveltekitCookies(getRequestEvent), lastLoginMethod(), haveIBeenPwned()]
});
