import Button from "@components/Button";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useDownloadReport } from "@hooks/useDownloadReport";
import { useLanguage } from "@stores/languageStore";
import { useModals } from "@stores/modalsStore";
import { type ChangeEvent, useEffect, useState } from "react";

export default function DownloadReportModal() {
	const { downloadReport: modal, updateModals } = useModals();

	const [startDate, setStartDate] = useState<string | undefined>(undefined);
	const [endDate, setEndDate] = useState<string | undefined>(undefined);
	const { language, currentLanguage } = useLanguage();

	const downloadReportMutation = useDownloadReport();

	useEffect(() => {
		if (!modal.isOpen) {
			reset();
		}
	}, [modal.isOpen]);

	function onStartDateChange(e: ChangeEvent) {
		setStartDate((e.target as HTMLInputElement).value);
	}

	function onEndDateChange(e: ChangeEvent) {
		setEndDate((e.target as HTMLInputElement).value);
	}

	function close() {
		updateModals({ downloadReport: { isOpen: false } });
	}

	function reset() {
		setStartDate(undefined);
		setEndDate(undefined);
	}

	async function download() {
		if (downloadReportMutation.isPending) {
			return;
		}

		if (!startDate || !endDate) {
			return;
		}

		const startDateTime = new Date(startDate);
		const endDateTime = new Date(endDate);

		await downloadReportMutation.mutateAsync({
			startDate: startDateTime.toISOString(),
			endDate: endDateTime.toISOString(),
			language: currentLanguage,
		});

		close();
	}

	return (
		<Dialog open={modal.isOpen} onClose={close} transition className="relative z-50">
			<div className="fixed inset-0 top-8 flex w-screen items-center justify-center bg-black/40">
				<DialogPanel className="flex w-full max-w-sm flex-col items-center rounded-lg bg-background-700 p-5 shadow-xl">
					<DialogTitle className="text-center font-bold text-white text-xl">{language.download_work_report}</DialogTitle>
					<Description className="mt-2 text-center text-white/80">{language.download_work_report_desc}</Description>
					<div className="mt-5 flex w-full select-none flex-col gap-y-2">
						<div className="flex flex-col gap-y-1">
							<div className="shrink-0 text-sm text-white/80">{language.start_date}:</div>
							<div className="relative">
								<input
									type="date"
									onChange={onStartDateChange}
									className="w-full rounded-sm bg-background-800 px-2 py-1 text-white [&::-webkit-calendar-picker-indicator]:opacity-0"
								/>
								<IconMingcuteCalendar2Fill className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 h-4 w-4 text-white/80" />
							</div>
						</div>
						<div className="flex flex-col gap-y-1">
							<div className="shrink-0 text-sm text-white/80">{language.end_date}:</div>
							<div className="relative">
								<input
									type="date"
									onChange={onEndDateChange}
									className="w-full rounded-sm bg-background-800 px-2 py-1 text-white [&::-webkit-calendar-picker-indicator]:opacity-0"
								/>
								<IconMingcuteCalendar2Fill className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 h-4 w-4 text-white/80" />
							</div>
						</div>
					</div>
					<div className="mt-5 flex w-full gap-x-2">
						<Button onClick={close} color="background-800">
							{language.cancel}
						</Button>
						<Button onClick={download} color="primary">
							{language.download}
						</Button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
