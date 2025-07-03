import InfoModal from "@components/modals/InfoModal";
import TopBar from "@components/TopBar";
import { initializeWindow } from "@stores/windowStore";
import { useEffect } from "react";
import { Outlet } from "react-router";

export default function AppLayout() {
	useEffect(() => {
		const unlisten = initializeWindow();

		return () => {
			unlisten();
		};
	}, []);

	return (
		<div className="flex h-full w-full flex-col bg-slate">
			<TopBar />
			<Outlet />
			<InfoModal />
		</div>
	);
}
