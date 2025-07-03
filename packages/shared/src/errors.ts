export enum ErrorType {
	INVALID_BODY = 0,
	NOT_FOUND = 1,
	INVALID_CREDENTIALS = 2,
	USERNAME_TAKEN = 3,
	EMAIL_TAKEN = 4,
	PASSWORD_TOO_SHORT = 5,
	INVALID_EMAIL = 6,
	UNAUTHORIZED = 7,
}

export type PTPError = {
	type: ErrorType;
	message: string;
};
