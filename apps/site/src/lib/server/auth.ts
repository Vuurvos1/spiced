import { db } from '$lib/db';
import { emailVerificationTable, passwordResetTokenTable, userTable } from '@app/db/schema';
import { eq } from 'drizzle-orm';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { generateIdFromEntropySize } from './utils';
import dayjs from 'dayjs';

export async function checkIfUserExists(email: string) {
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
}

export async function createEmailVerificationToken(userId: string, email: string): Promise<string> {
	// optionally invalidate all existing tokens
	const tokenId = generateIdFromEntropySize(25); // 40 characters long

	await db.transaction(async (trx) => {
		await trx.delete(emailVerificationTable).where(eq(emailVerificationTable.userId, userId));

		await trx.insert(emailVerificationTable).values({
			userId,
			email,
			token: tokenId,
			expiresAt: dayjs().add(2, 'hours').toDate()
		});
	});

	return tokenId;
}

export async function createPasswordResetToken(userId: string): Promise<string> {
	const tokenId = generateIdFromEntropySize(25); // 40 character
	const tokenHash = encodeHexLowerCase(await sha256(new TextEncoder().encode(tokenId)));
	await db.transaction(async (trx) => {
		await trx.delete(passwordResetTokenTable).where(eq(passwordResetTokenTable.userId, userId));

		await trx.insert(passwordResetTokenTable).values({
			tokenHash,
			userId,
			expiresAt: dayjs().add(2, 'hours').toDate()
		});
	});

	return tokenId;
}

export async function verifyEmailVerificationCode(userId: string, token: string) {
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
	if (dayjs().isAfter(dayjs(verificationCode.expiresAt))) {
		return {
			success: false,
			message: 'The verification code has expired, please request a new one.'
		};
	}

	// If everything is okay, delete the verification code from the database
	await db.delete(emailVerificationTable).where(eq(emailVerificationTable.userId, userId));

	// Return a success message
	return { success: true, message: 'Email verification successful!' };
}

export async function verifyPasswordResetToken(tokenId: string) {
	const [passwordResetToken] = await db
		.select()
		.from(passwordResetTokenTable)
		.where(eq(passwordResetTokenTable.tokenHash, tokenId));

	if (!passwordResetToken || passwordResetToken.tokenHash !== tokenId) {
		return {
			success: false,
			message: 'The password reset link is invalid. Please request a new one.'
		};
	}

	if (dayjs().isAfter(dayjs(passwordResetToken.expiresAt))) {
		return {
			success: false,
			message: 'The password reset link has expired. Please request a new one.'
		};
	}

	return {
		success: true,
		userId: passwordResetToken.userId,
		message: 'Password reset token is valid.'
	};
}
