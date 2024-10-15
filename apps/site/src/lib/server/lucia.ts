import type { Options as HashOptions } from '@node-rs/argon2';

export const hashSettings: HashOptions = {
	// recommended minimum parameters
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};
