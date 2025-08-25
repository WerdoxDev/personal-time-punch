import { Prisma } from "@prisma/client";
import { type Snowflake, snowflake, WorkerID, type WorkType } from "shared";
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
                options: { userId: Snowflake; timeOfEntry: string; timeOfExit?: string; type: WorkType },
                args?: Args,
            ) {
                const work = await prisma.work.create({
                    data: {
                        id: snowflake.generate(WorkerID.WORK),
                        timeOfEntry: options.timeOfEntry,
                        timeOfExit: options.timeOfExit,
                        type: options.type,
                        userId: BigInt(options.userId),
                    },
                    ...args,
                });

                return idFix(work) as BigIntToString<Prisma.WorkGetPayload<Args>>;
            },
            async updateWork<Args extends Prisma.WorkDefaultArgs>(id: Snowflake, options: { timeOfExit?: string, timeOfEntry?: string, type?: WorkType }, args?: Args) {
                const editedWork = await prisma.work.update({ where: { id: BigInt(id) }, data: { timeOfExit: options.timeOfExit, timeOfEntry: options.timeOfEntry, type: options.type }, ...args });

                return idFix(editedWork) as BigIntToString<Prisma.WorkGetPayload<Args>>;
            },
            async deleteWork<Args extends Prisma.WorkDefaultArgs>(id: Snowflake, args?: Args) {
                const deletedWork = await prisma.work.delete({ where: { id: BigInt(id) }, ...args });

                return idFix(deletedWork) as BigIntToString<Prisma.WorkGetPayload<Args>>;
            },
            async getUserWorks<Args extends Prisma.WorkDefaultArgs>(
                userId: Snowflake,
                startDate?: string,
                endDate?: string,
                args?: Args
            ) {
                const startTime = new Date(startDate ?? "");
                const endTime = new Date(endDate ?? "");
                endTime.setHours(23, 59, 59, 999);
                startTime.setHours(0, 0, 0, 0);

                const works = await prisma.work.findMany({
                    orderBy: { id: "asc" },
                    where: {
                        userId: BigInt(userId),
                        timeOfEntry: {
                            ...(startDate && { gte: startTime }),
                            ...(endDate && { lte: endTime })
                        }
                    },
                    ...args
                });

                return idFix(works) as BigIntToString<Prisma.WorkGetPayload<Args>>[];
            },
        },
    },
});
