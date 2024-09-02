import { fail, redirect, type Actions, type Cookies } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

// import { message, superValidate } from 'sveltekit-superforms/client';

// import { route } from '$lib/ROUTES';
// import {
// 	PENDING_USER_VERIFICATION_COOKIE_NAME,
// 	createAndSetSession,
// 	generateEmailVerificationCode,
// 	sendCodeRateLimiter,
// 	sendEmailVerificationCode,
// 	verifyCodeRateLimiter,
// 	verifyEmailVerificationCode,
// 	type PendingVerificationUserDataType
// } from '$lib/database/authUtils.server';
// import { database } from '$lib/database/database.server';
// import { lucia } from '$lib/database/luciaAuth.server';
// import { usersTable } from '$lib/database/schema';
// import type { AlertMessageType } from '$lib/types';
// import { DASHBOARD_ROUTE } from '$lib/utils/navLinks';
// import { EmailVerificationCodeZodSchema } from '$validations/AuthZodSchemas';
import { eq } from 'drizzle-orm';
import {
	createAndSetSession,
	createEmailVerificationToken,
	sendEmailVerificationToken,
	verifyEmailVerificationCode
} from '$lib/server/auth';
import { db } from '$lib/db';
import { userTable } from '@app/db/schema';
import { lucia } from '$lib/server/lucia';

type PendingVerificationUserDataType = {
	id: string;
	email: string;
};

// Function to parse user data from cookie
const getUserDataFromCookie = (cookies: Cookies) => {
	const cookieData = cookies.get('pendingUserVerification');

	if (!cookieData) return null;

	return JSON.parse(cookieData) as PendingVerificationUserDataType;
};

export const load = (async (event) => {
	// await verifyCodeRateLimiter.cookieLimiter?.preflight(event);
	// await sendCodeRateLimiter.cookieLimiter?.preflight(event);

	// Parse the user data from the cookie
	const userData = getUserDataFromCookie(event.cookies);

	if (!userData) {
		return redirect(303, '/signup');
	}

	return {
		pendingUserEmail: userData.email
	};

	// return {
	// 	emailVerificationCodeFormData: await superValidate(EmailVerificationCodeZodSchema)
	// };
}) satisfies PageServerLoad;

export const actions: Actions = {
	verifyCode: async (event) => {
		const { cookies, request } = event;

		const formData = await request.formData();

		// const password = formData.get('password');
		// const email = formData.get('email');

		const userData = getUserDataFromCookie(cookies);

		if (!userData) return redirect(303, '/signup');

		const verificationCode = formData.get('verificationCode') as string;

		// const emailVerificationCodeFormData = await superValidate<
		// 	typeof EmailVerificationCodeZodSchema,
		// 	AlertMessageType
		// >(request, EmailVerificationCodeZodSchema);

		// if (emailVerificationCodeFormData.valid === false) {
		if (!verificationCode) {
			return fail(400, {
				message: 'Invalid verification code, please try again'
			});

			// return message(emailVerificationCodeFormData, {
			// 	alertType: 'error',
			// 	alertText: 'Invalid verification code, please try again'
			// });
		}

		// const sendNewCodeRateLimiterResult = await verifyCodeRateLimiter.check(event);

		// if (sendNewCodeRateLimiterResult.limited) {
		// return message(
		// 	emailVerificationCodeFormData,
		// 	{
		// 		alertType: 'error',
		// 		alertText: `You have made too many requests and exceeded the rate limit. Please try again after ${sendNewCodeRateLimiterResult.retryAfter} seconds.`
		// 	},
		// 	{
		// 		status: 429
		// 	}
		// );
		// }

		const isVerificationCodeValid = await verifyEmailVerificationCode(
			userData.id,
			verificationCode
		);

		if (isVerificationCodeValid.success === false) {
			return fail(400, {
				message: isVerificationCodeValid.message
			});

			// return message(emailVerificationCodeFormData, {
			// 	alertType: 'error',
			// 	alertText: isVerificationCodeValid.message
			// });
		}

		await db.transaction(async (trx) => {
			const [existingUser] = await trx
				.select()
				.from(userTable)
				.where(eq(userTable.email, userData.email));

			const authMethods = existingUser?.authMethods ?? [];
			authMethods.push('email');

			await trx
				.update(userTable)
				.set({ emailVerified: true, authMethods })
				.where(eq(userTable.email, userData.email));
		});
		await createAndSetSession(lucia, userData.id, cookies);

		cookies.set('pendingUserVerification', '', {
			maxAge: 0,
			path: '/auth/email-verification'
		});

		throw redirect(303, '/');
	},

	sendNewCode: async (event) => {
		// const sendNewCodeRateLimiterResult = await sendCodeRateLimiter.check(event);

		// if (sendNewCodeRateLimiterResult.limited) {
		// 	return fail(429, {
		// 		message: `You have made too many requests and exceeded the rate limit. Please try again after ${sendNewCodeRateLimiterResult.retryAfter} seconds.`
		// 	});
		// }

		const userData = getUserDataFromCookie(event.cookies);

		if (!userData) return redirect(303, '/signup');

		const emailVerificationCode = await createEmailVerificationToken(userData.id, userData.email);

		const sendEmailVerificationCodeResult = await sendEmailVerificationToken(
			userData.email,
			emailVerificationCode
		);

		if (!sendEmailVerificationCodeResult.success) {
			return fail(500, {
				message: sendEmailVerificationCodeResult.message
			});
		}

		return {
			message: 'A new verification code has been sent to your email'
		};
	}
};
