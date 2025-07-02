import { useState } from "react";
// import { PostHogProvider } from "posthog-js/react";
// import posthog from "posthog-js";
import { Outlet } from "react-router";

export default function Root() {
	const [loaded, setLoaded] = useState(false);

	return <Outlet />;
}
