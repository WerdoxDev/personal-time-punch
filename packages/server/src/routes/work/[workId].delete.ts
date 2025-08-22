import type { APIDeleteWorkResult } from "shared";
import { prisma } from "../../database";
import { selectWork } from "../../database/common";
import { invalidWork, noPermission } from "../../errors";
import { createRoute, tryCatch, verifyJwt } from "../../utils";

createRoute("DELETE", "/work/:workId", verifyJwt(), async (c) => {
    const payload = c.get("tokenPayload");
    const id = c.req.param("workId");

    if (!await prisma.work.exists({ id: BigInt(id), userId: BigInt(payload.id) })) {
        return noPermission(c);
    }

    const [error, result] = await tryCatch(async () => prisma.work.deleteWork(id, { select: selectWork }));

    if (error) {
        return invalidWork(c);
    }

    return c.json(result as APIDeleteWorkResult);
});
