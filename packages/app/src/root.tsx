import { apiRequest } from "@lib/utils";
import { apiStore } from "@stores/apiStore";
// import { PostHogProvider } from "posthog-js/react";
// import posthog from "posthog-js";
import { type LoaderFunctionArgs, Outlet, redirect } from "react-router";
import type { APIGetCurrentUserResult } from "shared";

// FIXME: Posthog seems to not work with react router just yet
// const posthogClient = posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
// 	api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
// 	person_profiles: "always",
// 	autocapture: false,
// 	capture_pageview: false,
// });

const findIndex = window.location.hash.indexOf("?");
const initialPathname = window.location.hash.slice(0, findIndex === -1 ? undefined : findIndex);

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
