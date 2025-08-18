import { zValidator } from "@hono/zod-validator";
import type { Hono, ValidationTargets } from "hono";
import { createMiddleware } from "hono/factory";
import type { OnHandlerInterface } from "hono/types";
import type { TokenPayload } from "shared";
import type { ZodSchema } from "zod";
import { prisma } from "./database";
import { invalidBody, notFound, unauthorized } from "./errors";
import { verifyToken } from "./token-factory";

let appInstance: Hono;

export function setAppInstance(app: Hono): void {
	appInstance = app;
}

// @ts-ignore
const createRoute: OnHandlerInterface = (method, path: string, ...handlers) => {
	appInstance.on(method, path, ...handlers);
};

export { createRoute };

export function validator<T extends keyof ValidationTargets, S extends ZodSchema>(target: T, schema: S) {
	return zValidator(target, schema, (result, c) => {
		if (!result.success) {
			return target === "json" ? invalidBody(c) : notFound(c);
		}
	});
}

export type BigIntToString<T> = T extends bigint
	? string
	: T extends Date
	? Date
	: T extends (infer U)[]
	? BigIntToString<U>[]
	: T extends object
	? { [K in keyof T]: BigIntToString<T[K]> }
	: T;

export function idFix<T>(obj: T): BigIntToString<T> {
	if (Array.isArray(obj)) {
		return obj.map((item) => idFix(item)) as BigIntToString<T>;
	}
	if (obj instanceof Date) {
		return obj as unknown as BigIntToString<T>; // Do not convert Date objects
	}
	if (typeof obj === "object" && obj !== null) {
		const newObj: Record<string, unknown> = {};
		for (const key in obj) {
			if (typeof obj[key] === "bigint") {
				newObj[key] = (obj[key] as unknown as string).toString();
			} else if (typeof obj[key] === "object") {
				newObj[key] = idFix(obj[key]);
			} else {
				newObj[key] = obj[key];
			}
		}
		return newObj as BigIntToString<T>;
	}
	return obj as BigIntToString<T>;
}

export async function tryCatch<T>(fn: (() => Promise<T>) | (() => T)): Promise<[Error, null] | [null, T]> {
	try {
		return [null, await fn()];
	} catch (e) {
		return [e as Error, null];
	}
}

export const emailRegex =
	// biome-ignore lint/suspicious/noControlCharactersInRegex: it's regex
	/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm;

export function verifyJwt() {
	return createMiddleware(async (c, next) => {
		//TODO: THIS IS TO FIX A VERY WEIRD BUG IN HONO
		// await c.req.blob();

		const bearer = c.req.header("Authorization");

		if (!bearer) {
			return unauthorized(c);
		}

		const token = bearer.split(" ")[1];

		const { valid, payload } = await verifyToken(token);

		if (!valid || !payload) {
			return unauthorized(c);
		}

		if (!(await prisma.user.exists({ id: BigInt((payload as TokenPayload).id) }))) {
			return unauthorized(c);
		}

		c.set("token", token);
		c.set("tokenPayload", payload as unknown as TokenPayload);

		await next();
	});
}
