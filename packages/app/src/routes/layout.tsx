import CreateWorkModal from "@components/modals/CreateWorkModal";
import DownloadReportModal from "@components/modals/DownloadReportModal";
import EditWorkModal from "@components/modals/EditWorkModal";
import InfoModal from "@components/modals/InfoModal";
import TopBar from "@components/TopBar";
import { initializeLanguage, useLanguage } from "@stores/languageStore";
import { initializeWindow } from "@stores/windowStore";
import moment from "moment";
import { useEffect } from "react";
import { Outlet } from "react-router";

export default function AppLayout() {
	const { currentLanguage } = useLanguage();
	useEffect(() => {
		const unlisten = initializeWindow();
		initializeLanguage();

		return () => {
			unlisten();
		};
	}, []);

	useEffect(() => {
		moment.locale(currentLanguage);
	}, [currentLanguage]);

	return (
		<div className="flex h-full w-full flex-col overflow-hidden bg-slate">
			<TopBar />
			<Outlet />
			<InfoModal />
			<CreateWorkModal />
			<DownloadReportModal />
			<EditWorkModal />
		</div>
	);
}
