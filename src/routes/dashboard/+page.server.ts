import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import Session from '$lib/server/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ cookies }) => {
	const session = new Session(cookies);
	const sessval = await session.start();

	if (sessval['userid'] === undefined) {
		redirect(301, '/login');
	}

	const user = await prisma.user.findUnique({ where: { id: Number(sessval['userid']) } });

	if (!user) {
		throw error(401, `Unauthorized`);
	}

	console.info('Session value', sessval);

	return {
		post: {
			title: `Dashboard [${user.username}]`,
			content: `Hello ${user.username}, welcome to your dashboard!`
		}
	};
};
