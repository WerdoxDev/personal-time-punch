export const apiHost = "http://localhost:3000";

export function apiPath(path: string) {
	return `${apiHost}${path}`;
}
