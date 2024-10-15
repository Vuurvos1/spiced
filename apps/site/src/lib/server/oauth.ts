import { Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';

export const GOOGLE_OAUTH_STATE_COOKIE_NAME = 'google_oauth_state';
export const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME = 'google_code_verifier';

export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	PUBLIC_BASE_URL + '/login/google/callback'
);
