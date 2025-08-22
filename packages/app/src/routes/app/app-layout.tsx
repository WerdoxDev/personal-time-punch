import { Outlet } from "react-router";

export default function AppLayout() {
	return (
		<div className="absolute inset-0 top-8 overflow-hidden bg-background-900">
			<Outlet />
		</div>
	);
}
