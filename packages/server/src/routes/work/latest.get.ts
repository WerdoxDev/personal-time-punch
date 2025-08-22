import type { APIGetLatestWorkResult } from "shared";
import { prisma } from "../../database";
import { selectWork } from "../../database/common";
import { serverError } from "../../errors";
import { createRoute, idFix, tryCatch, verifyJwt } from "../../utils";

createRoute("GET", "/work/latest", verifyJwt(), async (c) => {
    const payload = c.get("tokenPayload");

    const [error, work] = await tryCatch(async () =>
        idFix(await prisma.work.findFirst({ where: { timeOfExit: null, userId: BigInt(payload.id) }, select: selectWork })),
    );

    if (error) {
        return serverError(c);
    }

    return c.json(work as APIGetLatestWorkResult, 200);
});
