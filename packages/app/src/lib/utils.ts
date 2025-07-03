export const apiHost = "http://localhost:3000";

export function apiPath(path: string) {
	return `${apiHost}${path}`;
}

export async function apiRequest(path: string, method: "POST" | "GET" | "PATCH", body: unknown, token?: string) {
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

export function formatElapsedSeconds(elapsedSeconds: number) {
	const hours = Math.floor(elapsedSeconds / 3600)
		.toString()
		.padStart(2, "0");
	const minutes = Math.floor((elapsedSeconds % 3600) / 60)
		.toString()
		.padStart(2, "0");
	const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");

	return `${hours}:${minutes}:${seconds}`;
}

export function formatTimestamp(timestamp: number) {
	const date = new Date(timestamp ?? 0);

	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const seconds = date.getSeconds().toString().padStart(2, "0");

	return `${hours}:${minutes}:${seconds}`;
}
