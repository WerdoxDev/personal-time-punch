import type { APIPostRegisterResult } from "shared";
import z from "zod";
import { prisma } from "../../database";
import { emailTaken, invalidEmail, passwordTooShort, usernameTaken } from "../../errors";
import { createToken } from "../../token-factory";
import { createRoute, emailRegex, idFix, validator } from "../../utils";

const schema = z.object({
	username: z.string().nonempty(),
	firstName: z.string().nonempty(),
	lastName: z.string().nonempty(),
	email: z.string().nonempty(),
	password: z.string().nonempty(),
});

createRoute("POST", "/auth/register", validator("json", schema), async (c) => {
	const body = c.req.valid("json");

	if (body.password.length < 8) {
		return passwordTooShort(c);
	}

	if (!body.email.match(emailRegex)) {
		return invalidEmail(c);
	}

	if (await prisma.user.exists({ username: body.username })) {
		return usernameTaken(c, body.username);
	}

	if (await prisma.user.exists({ email: body.email })) {
		return emailTaken(c, body.email);
	}

	const user = idFix(await prisma.user.createUser(body));
	const token = await createToken({ id: user.id });

	const json: APIPostRegisterResult = { token, user };
	return c.json(json, 201);
});
