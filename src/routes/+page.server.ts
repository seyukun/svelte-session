import type { PageServerLoad } from './$types';
import Session from '$lib/server/session';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const session = new Session(cookies);
	const sessval = await session.start();

	if (sessval['userid'] === undefined) {
		redirect(302, '/login');
	} else {
		redirect(302, '/dashboard');
	}
};
