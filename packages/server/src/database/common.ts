import { Prisma } from "@prisma/client";

export const selectPrivateUser = Prisma.validator<Prisma.UserSelect>()({
	id: true,
	firstName: true,
	lastName: true,
	username: true,
	email: true,
	password: true,
});

export const selectWork = Prisma.validator<Prisma.WorkSelect>()({
	id: true,
	createdAt: true, dayOfWeek: true, endTime: true, notes: true, startTime: true, updatedAt: true
})