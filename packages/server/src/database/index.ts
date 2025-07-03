import { Prisma, PrismaClient } from "@prisma/client";
import { userExtension } from "./user";

export const prismaBase = new PrismaClient();

export const prisma = prismaBase
	.$extends({
		model: {
			$allModels: {
				async exists<T>(this: T, where: Prisma.Args<T, "count">["where"]) {
					const context = Prisma.getExtensionContext(this);

					// biome-ignore lint/suspicious/noExplicitAny: context can't have a type here
					const result = await (context as any).count({ where });
					return result !== 0;
				},
			},
		},
	})
	.$extends(userExtension);
