import type { APIPostLoginResult } from "shared";
import z from "zod";
import { prisma } from "../../database";
import { invalidCredentials } from "../../errors";
import { createToken } from "../../token-factory";
import { createRoute, idFix, tryCatch, validator } from "../../utils";

const schema = z.object({ login: z.string(), password: z.string() });

createRoute("POST", "/auth/login", validator("json", schema), async (c) => {
	const body = c.req.valid("json");

	const [error, user] = await tryCatch(async () => idFix(await prisma.user.findByCredentials(body)));

	if (error || !user) {
		return invalidCredentials(c);
	}

	const token = await createToken({ id: user.id });

	const json: APIPostLoginResult = { token, user };
	return c.json(json, 200);
});
