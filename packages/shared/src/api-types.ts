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
