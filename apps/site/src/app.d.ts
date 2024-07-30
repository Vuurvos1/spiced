// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

/// <reference types="lucia" />

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}

		// auth: import('lucia').AuthRequest;
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// namespace Lucia {
	// 	type Auth = import('$lib/server/lucia').Auth;
	// 	type DatabaseUserAttributes = {};
	// 	type DatabaseSessionAttributes = {};
	// }
}

export {};
