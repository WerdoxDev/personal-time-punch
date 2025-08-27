// export const apiHost = "http://192.168.0.89:3001";
export const apiHost = "http://localhost:3001";

export function apiPath(path: string) {
	return `${apiHost}${path}`;
}

export async function apiRequest(path: string, method: "POST" | "GET" | "PATCH" | "DELETE", body: unknown, token?: string | null) {
	return await fetch(apiPath(path), {
		method,
		body: body ? JSON.stringify(body) : undefined,
		headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
	});
}

export async function getError(response: Response) {
	if (response.status >= 400 && response.status < 500) {
		return await response.json();
	}
	if (response.status >= 500) {
		return await response.text();
	}
}