import type { Snowflake } from "./snowflake";

export type APIUser = {
	id: Snowflake;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export type APIPostRegisterJSONBody = {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export type APIPostLoginJSONBody = {
	login: string;
	password: string;
};

export type APIPostLoginResult = {
	token: string;
	user: APIUser;
};

export type APIPostRegisterResult = {
	token: string;
	user: APIUser;
};

export type TokenPayload = {
	id: Snowflake;
};

export type APIGetCurrentUserResult = APIUser;
