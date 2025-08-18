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

export type APIWork = {
	id: Snowflake;
	startTime: string | Date;
	endTime?: string | Date;
	dayOfWeek: number;
	notes?: string;
	createdAt: string | Date;
	updatedAt: string | Date;
}

export type APIPostWorkJSONBody = {
	startTime: string | Date;
	endTime?: string;
	dayOfWeek: number | Date;
	notes?: string;
}

export type APIPatchWorkJSONBody = {
	id: Snowflake,
	endTime?: string
	notes?: string;
}

export type APIPatchWorkResult = APIWork;
export type APIPostWorkResult = APIWork;
export type APIGetWorkResult = APIWork;