import { useEffect, useState } from "react";
// import { PostHogProvider } from "posthog-js/react";
// import posthog from "posthog-js";
import { type LoaderFunctionArgs, Outlet, redirect } from "react-router";

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
	// posthog.capture("$pageview", { $current_url: window.origin + pathname });
	const unallowedPaths = ["/login", "/register", "/oauth-redirect"];
	const search = new URLSearchParams({ redirect: pathname });

	if (`#${pathname}` === initialPathname && pathname !== "/" && !unallowedPaths.includes(pathname) && !client?.isLoggedIn) {
		throw redirect(`/?${search.toString()}`);
	}
	if (`#${pathname}` === initialPathname && pathname !== "/" && !client?.isLoggedIn && unallowedPaths.includes(pathname)) {
		throw redirect("/");
	}
}

export default function Root() {
	const [loaded, setLoaded] = useState(false);

	return <Outlet />;
}
