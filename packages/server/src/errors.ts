import type { Context } from "hono";
import { ErrorType, type PTPError } from "shared";

export function invalidBody(c: Context) {
	const error: PTPError = { type: ErrorType.INVALID_BODY, message: "The provided body was malformed" };
	return c.json(error, 400);
}

export function notFound(c: Context) {
	const error: PTPError = { type: ErrorType.NOT_FOUND, message: "Not found" };
	return c.json(error, 404);
}

export function invalidCredentials(c: Context) {
	const error: PTPError = { type: ErrorType.INVALID_CREDENTIALS, message: "Login details are incorrect" };
	return c.json(error, 400);
}

export function usernameTaken(c: Context, username: string) {
	const error: PTPError = { type: ErrorType.USERNAME_TAKEN, message: `${username} is already taken` };
	return c.json(error, 400);
}

export function emailTaken(c: Context, email: string) {
	const error: PTPError = { type: ErrorType.USERNAME_TAKEN, message: `${email} is already taken` };
	return c.json(error, 400);
}

export function passwordTooShort(c: Context) {
	const error: PTPError = { type: ErrorType.PASSWORD_TOO_SHORT, message: "Password is too short (minimum 8 characters)" };
	return c.json(error, 400);
}

export function invalidEmail(c: Context) {
	const error: PTPError = { type: ErrorType.INVALID_EMAIL, message: "Email is not valid" };
	return c.json(error, 400);
}

export function unauthorized(c: Context) {
	const error: PTPError = { type: ErrorType.UNAUTHORIZED, message: "Not authorized" };
	return c.json(error, 403);
}

export function serverError(c: Context) {
	const error: PTPError = { type: ErrorType.SERVER_ERROR, message: "Server Error" };
	return c.json(error, 500);
}

export function invalidWork(c: Context) {
	const error: PTPError = { type: ErrorType.INVALID_WORK, message: "Invalid work" };
	return c.json(error, 400)
}

export function noPermission(c: Context) {
	const error: PTPError = { type: ErrorType.NO_PERMISSION, message: "No permission" };
	return c.json(error, 403);
}