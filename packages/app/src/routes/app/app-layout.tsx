import { Outlet } from "react-router";

export default function AppLayout() {
	return (
		<div className="h-full w-full bg-background-900">
			<Outlet />
		</div>
	);
}
