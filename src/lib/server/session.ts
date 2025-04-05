import type { Cookies } from '@sveltejs/kit';
import crypto from 'crypto';
import Keyv from 'keyv';
import { Logger } from 'tslog';

const keyv = new Keyv<SessionValue>();

const console = new Logger();

type SessionValue = {
	[key: string]: string;
};

export default class Session {
	constructor(private cookies: Cookies) {}

	private ttl = 60 * 30 * 1000; // 30 minutes
	private id: string | undefined = undefined;
	private value: SessionValue = {};

	public async start(): Promise<SessionValue> {
		let sessionId = this.cookies.get('sessid');
		let sessionValue: SessionValue | undefined = undefined;

		if (sessionId !== undefined) {
			sessionValue = (await keyv.get(sessionId)) ?? undefined;
		}

		if (sessionId && sessionValue) {
			this.id = sessionId;
			this.value = sessionValue;
		} else {
			this.id = crypto.randomBytes(16).toString('hex');
			this.cookies.set('sessid', this.id, {
				path: '/',
				expires: new Date(Date.now() + this.ttl)
			});

			// TTL 30min
			await keyv.set(this.id, {}, this.ttl);
		}

		return this.createAutoSavingProxy(this.value);
	}

	public async destroy(): Promise<void> {
		if (this.id === undefined) {
			this.id = this.cookies.get('sessid');
		}

		if (this.id !== undefined) {
			await keyv.delete(this.id);
			this.id = undefined;
			this.value = {};
			this.cookies.delete('sessid', { path: '/' });
			return;
		}
	}

	public async regenerate(): Promise<void> {
		if (this.id === undefined) {
			return undefined;
		}

		const prevId = this.id;
		this.id = crypto.randomBytes(16).toString('hex');

		await keyv.set(this.id, this.value, this.ttl);
		await keyv.delete(prevId);

		this.cookies.set('sessid', this.id, {
			path: '/',
			expires: new Date(Date.now() + this.ttl)
		});

		return;
	}

	public setTtl(ttl: number): number {
		this.ttl = ttl;
		return ttl;
	}

	private createAutoSavingProxy(target: SessionValue): SessionValue {
		const handler: ProxyHandler<SessionValue> = {
			set: (target, prop, value, receiver) => {
				console.debug('Setting session value', prop, value);
				const result = Reflect.set(target, prop, value, receiver);
				keyv.set(this.id!, target, this.ttl);
				return result;
			}
		};
		return new Proxy(target, handler);
	}
}
