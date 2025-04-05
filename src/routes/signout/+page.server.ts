import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import Session from '$lib/server/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ cookies }) => {
	const session = new Session(cookies);
	const sessval = await session.start();

	console.log('Session value', sessval);

	if (sessval['userid'] === undefined) {
		console.log('Session not found', sessval['userid']);
		redirect(301, '/login');
	}

	const user = await prisma.user.findUnique({ where: { id: Number(sessval['userid']) } });
	if (!user) {
		console.log('Session not found', sessval['userid']);
		redirect(301, '/login');
	}
};

export const actions = {
	signout: async ({ cookies }) => {
		const session = new Session(cookies);
		await session.start();
		await session.destroy();

		redirect(301, '/login');
	}
} satisfies Actions;
