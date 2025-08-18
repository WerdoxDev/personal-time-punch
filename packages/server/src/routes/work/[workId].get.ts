import type { APIPatchWorkResult } from "shared";
import { prisma } from "../../database";
import { selectWork } from "../../database/common";
import { invalidWork, noPermission } from "../../errors";
import { createRoute, tryCatch, verifyJwt } from "../../utils";

createRoute("GET", "/work/:workId", verifyJwt(), async (c) => {
    const payload = c.get("tokenPayload");
    const id = c.req.param("workId");

    const [error, result] = await tryCatch(async () => prisma.work.getById(id, { select: { ...selectWork, userId: true } }));

    if (error || !result) {
        return invalidWork(c);
    }

    if (result.userId !== payload.id) {
        return noPermission(c);
    }

    const { userId: _, ...work } = result;

    return c.json(work as APIPatchWorkResult);
});
