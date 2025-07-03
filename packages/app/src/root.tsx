import { apiRequest } from "@lib/utils";
import { apiStore } from "@stores/apiStore";
import { type LoaderFunctionArgs, Outlet, redirect } from "react-router";
import type { APIGetCurrentUserResult } from "shared";

export async function rootLoader({ request }: LoaderFunctionArgs) {
	const pathname = new URL(request.url).pathname;
	const store = apiStore.getState();

	if (store.user || pathname === "/login") {
		return;
	}

	const token = localStorage.getItem("token");
	if (!token) {
		throw redirect("/login");
	}

	const response = await apiRequest("/users/current", "GET", undefined, token);

	if (response.ok) {
		const user: APIGetCurrentUserResult = await response.json();
		store.initialize(token, user);

		throw redirect("/app");
	}

	console.log("REDIRECT");

	throw redirect("/login");
}

export default function Root() {
	return <Outlet />;
}
