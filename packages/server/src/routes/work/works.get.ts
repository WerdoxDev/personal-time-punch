import type { APIGetWorksResult } from "shared";
import { prisma } from "../../database";
import { selectWork } from "../../database/common";
import { serverError } from "../../errors";
import { createRoute, tryCatch, verifyJwt } from "../../utils";

createRoute("GET", "/works", verifyJwt(), async (c) => {
    const payload = c.get("tokenPayload");

    const [error, works] = await tryCatch(async () => prisma.work.getUserWorks(payload.id, undefined, undefined, { select: selectWork }));

    if (error) {
        return serverError(c);
    }

    return c.json(works as APIGetWorksResult, 200);
});