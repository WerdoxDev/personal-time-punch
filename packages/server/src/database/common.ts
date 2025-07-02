import { Prisma } from "@prisma/client";

export const selectPrivateUser = Prisma.validator<Prisma.UserSelect>()({
	id: true,
	firstName: true,
	lastName: true,
	username: true,
	email: true,
	password: true,
});
