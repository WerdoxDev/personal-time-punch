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

export enum WorkType {
	ONSITE = 0,
	REMOTE = 1,
	ABSENT = 2,
	VACATION = 3
}

export type APIWork = {
	id: Snowflake;
	timeOfEntry: string | Date;
	timeOfExit?: string | Date;
	type: WorkType;
}

export type APIPostWorkJSONBody = {
	timeOfEntry: string | Date;
	timeOfExit?: string | Date;
	type: WorkType;
}

export type APIPostReportJSONBody = {
	startDate: string;
	endDate: string;
}

export type APIPatchWorkJSONBody = {
	id: Snowflake,
	timeOfExit?: string
	timeOfEntry?: string;
	type?: WorkType;
}

export type APIDeleteWorkResult = APIWork;
export type APIPatchWorkResult = APIWork;
export type APIPostWorkResult = APIWork;
export type APIGetWorkResult = APIWork;
export type APIGetLatestWorkResult = APIWork | null;
export type APIGetWorksResult = APIWork[];