import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import {
	google,
	GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME,
	GOOGLE_OAUTH_STATE_COOKIE_NAME
} from '$lib/server/lucia';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/db';
import { oauthAccountTable, userTable } from '@app/db/schema';
import { eq, and } from 'drizzle-orm';
import { createAndSetSessionTokenCookie } from '$lib/server/session';

type GoogleUser = {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
};

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get(GOOGLE_OAUTH_STATE_COOKIE_NAME);
	const codeVerifier = event.cookies.get(GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME);

	if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);

		const googleUserResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const googleUser = (await googleUserResponse.json()) as GoogleUser;

		if (!googleUser.email) {
			return new Response('No primary email address', {
				status: 400
			});
		}

		if (!googleUser.email_verified) {
			return new Response('Unverified email', {
				status: 400
			});
		}

		// Check if the user already exists
		const [existingUser] = await db
			.select()
			.from(userTable)
			.where(eq(userTable.email, googleUser.email));

		if (existingUser) {
			// Check if the user already has a Google OAuth account linked
			const [existingOauthAccount] = await db
				.select()
				.from(oauthAccountTable)
				.where(
					and(
						eq(oauthAccountTable.providerId, 'google'),
						eq(oauthAccountTable.providerUserId, googleUser.sub)
					)
				);

			if (!existingOauthAccount) {
				// Add the 'google' auth provider to the user's authMethods list
				const authMethods = existingUser.authMethods || [];
				authMethods.push('google');

				await db.transaction(async (trx) => {
					// Link the Google OAuth account to the existing user
					await trx.insert(oauthAccountTable).values({
						userId: existingUser.id,
						providerId: 'google',
						providerUserId: googleUser.sub
					});

					// Update the user's authMethods list
					await trx
						.update(userTable)
						.set({
							authMethods
						})
						.where(eq(userTable.id, existingUser.id));
				});
			}

			createAndSetSessionTokenCookie(existingUser.id, event.cookies);
		} else {
			// Create a new user and their OAuth account
			const userId = generateId(15);

			await db.transaction(async (trx) => {
				await trx.insert(userTable).values({
					id: userId,
					username: googleUser.name,
					email: googleUser.email,
					emailVerified: true,
					authMethods: ['google']
				});

				await trx.insert(oauthAccountTable).values({
					userId,
					providerId: 'google',
					providerUserId: googleUser.sub
				});
			});

			await createAndSetSessionTokenCookie(userId, event.cookies);
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (error) {
		console.error(error);

		// the specific error message depends on the provider
		if (error instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}

		return new Response(null, {
			status: 500
		});
	}
}
