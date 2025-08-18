import { Prisma } from "@prisma/client";
import { type APIPostLoginJSONBody, type APIPostRegisterJSONBody, type Snowflake, snowflake, WorkerID } from "shared";
import { type BigIntToString, idFix } from "../utils";
import { prisma } from ".";
import { selectPrivateUser } from "./common";

export const userExtension = Prisma.defineExtension({
	model: {
		user: {
			async getById<Args extends Prisma.UserDefaultArgs>(id: Snowflake, args?: Args) {
				const user = await prisma.user.findUnique({ where: { id: BigInt(id) }, ...args });

				return idFix(user) as BigIntToString<Prisma.UserGetPayload<Args>>;
			},
			async findByCredentials(credentials: APIPostLoginJSONBody) {
				const user = await prisma.user.findFirst({
					where: {
						AND: [
							{ password: credentials.password },
							{
								OR: [{ email: credentials.login }, { username: credentials.login }],
							},
						],
					},
					select: selectPrivateUser,
				});

				return idFix(user) as BigIntToString<NonNullable<typeof user>>;
			},
			async createUser(user: APIPostRegisterJSONBody) {
				const newUser = await prisma.user.create({
					data: {
						id: snowflake.generate(WorkerID.AUTH),
						email: user.email,
						username: user.username,
						firstName: user.firstName,
						lastName: user.lastName,
						password: user.password,
					},
					select: selectPrivateUser,
				});

				return idFix(newUser);
			},
		},
	},
});
