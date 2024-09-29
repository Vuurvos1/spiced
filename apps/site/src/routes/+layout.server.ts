export const load = async ({ locals: { session, user } }) => {
	// Is this a good idea?
	return { session, user };
};
