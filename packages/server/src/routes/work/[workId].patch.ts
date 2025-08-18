import type { APIPatchWorkResult } from "shared";
import z from "zod";
import { prisma } from "../../database";
import { selectWork } from "../../database/common";
import { invalidBody, invalidWork } from "../../errors";
import { createRoute, tryCatch, validator, verifyJwt } from "../../utils";

const schema = z.object({ endTime: z.optional(z.string()), notes: z.optional(z.string()) });

createRoute("PATCH", "/work/:workId", verifyJwt(), validator("json", schema), async (c) => {
    const id = c.req.param("workId");
    const body = c.req.valid("json");

    if (!body.endTime && !body.notes) {
        return invalidBody(c);
    }

    const [error, result] = await tryCatch(async () =>
        prisma.work.updateWork(id, { endTime: body.endTime, notes: body.notes }, { select: selectWork }),
    );

    if (error) {
        return invalidWork(c);
    }

    return c.json(result as APIPatchWorkResult);
});
