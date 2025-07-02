import { Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<div className="relative flex h-full w-full items-center justify-center bg-background-900">
			<div className="w-full max-w-sm rounded-lg bg-background-800 p-5 shadow-xl">
				<Outlet />
			</div>
		</div>
	);
}
