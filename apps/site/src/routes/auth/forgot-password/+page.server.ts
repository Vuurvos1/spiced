import { db } from '$lib/db.js';
import { createPasswordResetToken, verifyPasswordResetToken } from '$lib/server/auth';
import { sendPasswordResetEmail } from '$lib/server/email';
import { userTable } from '@app/db/schema';
import { fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

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
	sendPasswordResetEmail: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email') as string;

		if (!email) {
			return fail(400, {
				message: 'Email is missing from the request.'
			});
		}

		const [user] = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);

		if (!user) {
			return fail(400, {
				message: 'User with this email does not exist.'
			});
		}

		const verificationToken = await createPasswordResetToken(user.id);

		const sendResetResult = await sendPasswordResetEmail(email, verificationToken);

		if (!sendResetResult.success) {
			return fail(500, {
				message: 'There was a problem sending the password reset email.'
			});
		}

		// return new Response(null, {
		// 	status: 200
		// });
	}
};
