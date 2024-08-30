import { db } from '$lib/db';
import { userTable } from '@app/db/schema';
import type { Cookies } from '@sveltejs/kit';
import type { Lucia } from 'lucia';
import { eq } from 'drizzle-orm';

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
