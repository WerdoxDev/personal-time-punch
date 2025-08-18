import type { APIPostWorkResult } from "shared";
import z from "zod";
import { prisma } from "../../database";
import { selectWork } from "../../database/common";
import { invalidBody, serverError } from "../../errors";
import { createRoute, tryCatch, validator, verifyJwt } from "../../utils";

const schema = z.object({ startTime: z.string(), endTime: z.optional(z.string()), dayOfWeek: z.number(), notes: z.optional(z.string()) });

createRoute("POST", "/work", verifyJwt(), validator("json", schema), async (c) => {
    const body = c.req.valid("json");
    const payload = c.get("tokenPayload");

    if (body.dayOfWeek < 1 || body.dayOfWeek > 7) {
        return invalidBody(c);
    }

    const [error, work] = await tryCatch(async () =>
        prisma.work.createWork(
            { userId: payload.id, dayOfWeek: body.dayOfWeek, startTime: body.startTime, endTime: body.endTime, notes: body.notes },
            { select: selectWork },
        ),
    );

    if (error) {
        return serverError(c);
    }

    return c.json(work as APIPostWorkResult, 201);
});