import { PrismaClient } from "@prisma/client";

export const prismaBase = new PrismaClient();

export const prisma = prismaBase;
