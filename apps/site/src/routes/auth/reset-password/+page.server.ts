import { db } from '$lib/db.js';
import { createAndSetSession, verifyPasswordResetToken } from '$lib/server/auth';
import { lucia } from '$lib/server/lucia';
import { createAndSetSessionTokenCookie } from '$lib/server/session';
import { passwordResetTokenTable, userTable } from '@app/db/schema';
import { hash } from '@node-rs/argon2';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';

export const load = async (event) => {
	// await passwordResetPageActionRateLimiter.cookieLimiter?.preflight(event);
	const passwordResetToken = event.url.searchParams.get('token');
	if (passwordResetToken) {
		const { success, message } = await verifyPasswordResetToken(passwordResetToken);
		return {
			passwordResetTokenStatus: {
				isValid: success,
				message
			}
		};
	}
	// if (!passwordResetToken) {
	// 	error(400, 'Password reset token is missing from the request.');
	// }
	// const { success, message } = await verifyPasswordResetToken(passwordResetToken);
	// return {
	// 	passwordResetTokenStatus: {
	// 		isValid: success,
	// 		message
	// 	},
	// 	passwordResetFormData: await superValidate(PasswordResetZodSchema)
	// };

	return {};
};

export const actions: Actions = {
	resetPassword: async (event) => {
		const formData = await event.request.formData();

		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		// TODO: maybe put in url?

		// TODO: move this to a generic place, so it can also be used during signup
		if (typeof password !== 'string' || password.length < 8) {
			fail(400, {
				message: 'Password must be at least 8 characters long'
			});
		}

		if (password !== confirmPassword) {
			fail(400, {
				message: 'Passwords do not match'
			});
		}

		const verificationToken = formData.get('token') as string;

		if (!verificationToken) {
			return fail(400, {
				message: 'Verification token is missing from the request.'
			});
		}

		try {
			const tokenHash = encodeHex(await sha256(new TextEncoder().encode(verificationToken)));

			const verifyPasswordResetTokenResult = await verifyPasswordResetToken(tokenHash);
			if (verifyPasswordResetTokenResult.success === false) {
				return fail(400, {
					message: verifyPasswordResetTokenResult.message
				});
			}
			const userId = verifyPasswordResetTokenResult.userId;
			if (userId) {
				// const isSamePassword = await isSameAsOldPassword(
				// 	userId,
				// 	passwordResetFormData.data.newPassword
				// );
				// if (isSamePassword === true) {
				// 	return message(
				// 		passwordResetFormData,
				// 		{
				// 			alertType: 'error',
				// 			alertText: 'Your new password cannot be the same as your old password.'
				// 		},
				// 		{
				// 			status: 400 // This status code indicates that the server could not understand the request due to invalid syntax (new password is the same as the old password).
				// 		}
				// 	);
				// }

				// Hash the new password
				const hashedPassword = await hash(password);
				// Invalidate all user sessions before updating the password for security reasons
				await lucia.invalidateUserSessions(userId);
				await db.transaction(async (trx) => {
					// Delete the password reset token from the database
					await trx
						.delete(passwordResetTokenTable)
						.where(eq(passwordResetTokenTable.tokenHash, verificationToken));
					// Update the user's password in the database
					await trx
						.update(userTable)
						.set({ passwordHash: hashedPassword })
						.where(eq(userTable.id, userId));
				});
				// create session to log the user in
				await createAndSetSessionTokenCookie(userId, event.cookies);
			}
		} catch (error) {
			console.error('Error in resetPassword action:', error);
			return fail(500, {
				message: 'There was a problem with your submission.'
			});
		}

		throw redirect(302, '/');
	}
};
