import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import Session from '$lib/server/session';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ cookies }) => {
	const session = new Session(cookies);
	const sessval =  await session.start();

	if (sessval['userid'] !== undefined) {
		redirect(301, '/dashboard');
	}

	return { error: false };
};

export const actions = {
	login: async ({ cookies, request }) => {
		const session = new Session(cookies);
		const sessval = await session.start();

		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		const user = await prisma.user.findFirst({ where: { email: email, password: password } });

		if (user) {
			sessval['userid'] = user.id.toString();
			await session.regenerate();
			redirect(301, '/dashboard');
		}

		return { error: true };
	}
} satisfies Actions;
