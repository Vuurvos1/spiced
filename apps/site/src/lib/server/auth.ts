import { db } from '$lib/db';
import { emailVerificationTable, userTable } from '@app/db/schema';
import type { Cookies } from '@sveltejs/kit';
import { generateIdFromEntropySize, type Lucia } from 'lucia';
import { eq } from 'drizzle-orm';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { sendEmail } from './email';

export const checkIfUserExists = async (email: string) => {
	const [user] = await db
		.select({
			id: userTable.id,
			email: userTable.email,
			isEmailVerified: userTable.emailVerified,
			passwordHash: userTable.passwordHash,
			authMethods: userTable.authMethods
		})
		.from(userTable)
		.where(eq(userTable.email, email));

	return user;
};

export async function createEmailVerificationToken(userId: string, email: string): Promise<string> {
	// optionally invalidate all existing tokens
	const tokenId = generateIdFromEntropySize(25); // 40 characters long

	await db.transaction(async (trx) => {
		await trx.delete(emailVerificationTable).where(eq(emailVerificationTable.userId, userId));

		await trx.insert(emailVerificationTable).values({
			userId,
			email,
			token: tokenId,
			expiresAt: createDate(new TimeSpan(2, 'h'))
		});
	});

	return tokenId;
}

export async function sendEmailVerificationToken(email: string, token: string) {
	console.info('Sending email verification token to:', email);
	const htmlContent = `
	<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
		<h1>Email Verification</h1>
		<p>Thank you for taking the time to verify your email address. Your verification code is:</p>
		<p style="font-size: 20px;"><strong>${token}</strong></p>
		<p>Please enter this code in the verification field to complete the process. If you did not request this verification, please ignore this email.</p>
	</div>
	`;
	return sendEmail({
		email,
		subject: 'Email Verification Code Request',
		htmlContent
	});
}

export const verifyEmailVerificationCode = async (userId: string, token: string) => {
	const [verificationCode] = await db
		.select()
		.from(emailVerificationTable)
		.where(eq(emailVerificationTable.userId, userId));

	// If there's no verification code for the user in the database
	if (!verificationCode) {
		return { success: false, message: 'Verification code not found.' };
	}

	// If the provided code doesn't match the one in the database
	if (verificationCode.token !== token) {
		return { success: false, message: 'The provided verification code is incorrect.' };
	}

	// If the verification code has expired
	if (!isWithinExpirationDate(verificationCode.expiresAt)) {
		return {
			success: false,
			message: 'The verification code has expired, please request a new one.'
		};
	}

	// If everything is okay, delete the verification code from the database
	await db.delete(emailVerificationTable).where(eq(emailVerificationTable.userId, userId));

	// Return a success message
	return { success: true, message: 'Email verification successful!' };
};

export const createAndSetSession = async (lucia: Lucia, userId: string, cookies: Cookies) => {
	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};

export const deleteSessionCookie = async (lucia: Lucia, cookies: Cookies) => {
	const sessionCookie = lucia.createBlankSessionCookie();

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
};
