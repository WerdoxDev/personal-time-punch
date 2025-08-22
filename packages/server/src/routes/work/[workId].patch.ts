import type { APIPatchWorkResult } from "shared";
import z from "zod";
import { prisma } from "../../database";
import { selectWork } from "../../database/common";
import { invalidBody, invalidWork, noPermission } from "../../errors";
import { createRoute, tryCatch, validator, verifyJwt } from "../../utils";

const schema = z.object({ timeOfExit: z.optional(z.string()), timeOfEntry: z.optional(z.string()), type: z.optional(z.number()) });

createRoute("PATCH", "/work/:workId", verifyJwt(), validator("json", schema), async (c) => {
    const payload = c.get("tokenPayload");
    const id = c.req.param("workId");
    const body = c.req.valid("json");

    if (!body.timeOfEntry && !body.timeOfExit && !body.type) {
        return invalidBody(c);
    }

    if (!await prisma.work.exists({ id: BigInt(id), userId: BigInt(payload.id) })) {
        return noPermission(c);
    }

    const [error, result] = await tryCatch(async () =>
        prisma.work.updateWork(id, { timeOfExit: body.timeOfExit, timeOfEntry: body.timeOfEntry, type: body.type }, { select: selectWork }),
    );

    if (error) {
        return invalidWork(c);
    }

    return c.json(result as APIPatchWorkResult);
});
