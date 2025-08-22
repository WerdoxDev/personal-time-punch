import { type APIPostWorkResult, WorkType } from "shared";
import z from "zod";
import { prisma } from "../../database";
import { selectWork } from "../../database/common";
import { serverError } from "../../errors";
import { createRoute, tryCatch, validator, verifyJwt } from "../../utils";

const schema = z.object({ timeOfEntry: z.string(), timeOfExit: z.optional(z.string()), type: z.number() });

createRoute("POST", "/work", verifyJwt(), validator("json", schema), async (c) => {
    const body = c.req.valid("json");
    const payload = c.get("tokenPayload");

    const [error, work] = await tryCatch(async () =>
        prisma.work.createWork(
            {
                userId: payload.id,
                timeOfEntry: body.timeOfEntry,
                timeOfExit: body.type === WorkType.ABSENT || body.type === WorkType.VACATION ? undefined : body.timeOfExit,
                type: body.type,
            },
            { select: selectWork },
        ),
    );

    if (error) {
        return serverError(c);
    }

    return c.json(work as APIPostWorkResult, 201);
});
