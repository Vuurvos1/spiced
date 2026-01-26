// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// import type { User, Session } from '@app/db/types';
import type { auth } from "$lib/auth";


declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: typeof auth.$Infer.Session.user | null;
			session: typeof auth.$Infer.Session.session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
