import type { APIGetCurrentUserResult } from "shared";
import { prisma } from "../../database";
import { selectPrivateUser } from "../../database/common";
import { createRoute, idFix, verifyJwt } from "../../utils";

createRoute("GET", "/users/current", verifyJwt(), async (c) => {
	const payload = c.get("tokenPayload");

	const user: APIGetCurrentUserResult = idFix(await prisma.user.getById(payload.id, { select: selectPrivateUser }));

	return c.json(user, 200);
});
