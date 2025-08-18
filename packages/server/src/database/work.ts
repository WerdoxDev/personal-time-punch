import { Prisma } from "@prisma/client";
import { type Snowflake, snowflake, WorkerID } from "shared";
import { type BigIntToString, idFix } from "../utils";
import { prisma } from ".";

export const workExtension = Prisma.defineExtension({
    model: {
        work: {
            async getById<Args extends Prisma.WorkDefaultArgs>(id: Snowflake, args?: Args) {
                const work = await prisma.work.findUnique({ where: { id: BigInt(id) }, ...args });

                return idFix(work) as BigIntToString<Prisma.WorkGetPayload<Args>>;
            },
            async createWork<Args extends Prisma.WorkDefaultArgs>(
                options: { userId: Snowflake; startTime: string; endTime?: string; dayOfWeek: number; notes?: string },
                args?: Args,
            ) {
                const work = await prisma.work.create({
                    data: {
                        id: snowflake.generate(WorkerID.WORK),
                        dayOfWeek: options.dayOfWeek,
                        startTime: options.startTime,
                        endTime: options.endTime,
                        notes: options.notes,
                        userId: BigInt(options.userId)
                    },
                    ...args,
                });

                return idFix(work) as BigIntToString<Prisma.WorkGetPayload<Args>>;
            },
            async updateWork<Args extends Prisma.WorkDefaultArgs>(
                id: Snowflake,
                options: { endTime?: string; notes?: string },
                args?: Args,
            ) {
                const editedWork = await prisma.work.update({ where: { id: BigInt(id) }, data: { endTime: options.endTime, notes: options.notes }, ...args });

                return idFix(editedWork) as BigIntToString<Prisma.WorkGetPayload<Args>>;
            }
        },
    },
});
