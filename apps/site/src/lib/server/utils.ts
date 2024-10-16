import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import type { Options as HashOptions } from '@node-rs/argon2';

export const hashSettings: HashOptions = {
	// recommended minimum parameters
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export function generateIdFromEntropySize(size: number) {
	const buffer = crypto.getRandomValues(new Uint8Array(size));
	return encodeBase32LowerCaseNoPadding(buffer);
}
