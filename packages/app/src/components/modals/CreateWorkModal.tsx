import Button from "@components/Button";
import { Dropdown } from "@components/Dropdown";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useCreateWork } from "@hooks/useCreateWork";
import type { DropdownOption } from "@lib/types";
import { useLanguage } from "@stores/languageStore";
import { useModals } from "@stores/modalsStore";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { WorkType } from "shared";

const hourOptions: DropdownOption<number>[] = [
	{ text: "00", value: 0 },
	{ text: "01", value: 1 },
	{ text: "02", value: 2 },
	{ text: "03", value: 3 },
	{ text: "04", value: 4 },
	{ text: "05", value: 5 },
	{ text: "06", value: 6 },
	{ text: "07", value: 7 },
	{ text: "08", value: 8 },
	{ text: "09", value: 9 },
	{ text: "10", value: 10 },
	{ text: "11", value: 11 },
	{ text: "12", value: 12 },
	{ text: "13", value: 13 },
	{ text: "14", value: 14 },
	{ text: "15", value: 15 },
	{ text: "16", value: 16 },
	{ text: "17", value: 17 },
	{ text: "18", value: 18 },
	{ text: "19", value: 19 },
	{ text: "20", value: 20 },
	{ text: "21", value: 21 },
	{ text: "22", value: 22 },
	{ text: "23", value: 23 },
];

const minuteOptions: DropdownOption<number>[] = [
	{ text: "00", value: 0 },
	{ text: "05", value: 5 },
	{ text: "10", value: 10 },
	{ text: "15", value: 15 },
	{ text: "20", value: 20 },
	{ text: "25", value: 25 },
	{ text: "30", value: 30 },
	{ text: "35", value: 35 },
	{ text: "40", value: 40 },
	{ text: "45", value: 45 },
	{ text: "50", value: 50 },
	{ text: "55", value: 55 },
];

export default function CreateWorkModal() {
	const { createWork: modal, updateModals } = useModals();
	const { language, currentLanguage } = useLanguage();

	const typeOptions = useMemo<DropdownOption<WorkType>[]>(
		() => [
			{ text: language.remote, value: WorkType.REMOTE },
			{ text: language.onsite, value: WorkType.ONSITE },
			{ text: language.absent, value: WorkType.ABSENT },
			{ text: language.vacation, value: WorkType.VACATION },
		],
		[currentLanguage],
	);

	const [date, setDate] = useState<string | undefined>(undefined);

	const [entryHour, setEntryHour] = useState<DropdownOption<number>>(hourOptions[0]);
	const [entryMinute, setEntryMinute] = useState<DropdownOption<number>>(minuteOptions[0]);

	const [exitHour, setExitHour] = useState<DropdownOption<number>>(hourOptions[0]);
	const [exitMinute, setExitMinute] = useState<DropdownOption<number>>(minuteOptions[0]);

	const [type, setType] = useState<DropdownOption<WorkType>>(typeOptions[0]);

	const createWorkMutation = useCreateWork();

	useEffect(() => {
		if (!modal.isOpen) {
			reset();
		}
	}, [modal.isOpen]);

	useEffect(() => {
		setType(typeOptions[0]);
	}, [currentLanguage]);

	function onDateChange(e: ChangeEvent) {
		setDate((e.target as HTMLInputElement).value);
	}

	function close() {
		updateModals({ createWork: { isOpen: false } });
	}

	function reset() {
		setEntryHour(hourOptions[0]);
		setEntryMinute(minuteOptions[0]);
		setExitHour(hourOptions[0]);
		setExitMinute(minuteOptions[0]);
		setType(typeOptions[0]);
		setDate(undefined);
	}

	async function create() {
		if (createWorkMutation.isPending || !date) {
			return;
		}

		if (entryHour.value > exitHour.value || (entryHour.value === exitHour.value && entryMinute.value > exitMinute.value)) {
			updateModals({
				info: { isOpen: true, onConfirm: undefined, status: "warn", title: language.incorrect_date_title, text: language.incorrect_date_text },
			});
			return;
		}

		const entryDateTime = new Date(date);
		entryDateTime.setHours(entryHour.value, entryMinute.value, 0, 0);

		const exitDateTime = new Date(date);
		exitDateTime.setHours(exitHour.value, exitMinute.value, 0, 0);

		await createWorkMutation.mutateAsync({
			timeOfEntry: entryDateTime.toISOString(),
			timeOfExit: type.value === WorkType.ONSITE || type.value === WorkType.REMOTE ? exitDateTime.toISOString() : undefined,
			type: type.value,
		});

		close();
	}

	return (
		<Dialog open={modal.isOpen} onClose={close} transition className="relative z-50">
			<div className="fixed inset-0 top-8 flex w-screen items-center justify-center bg-black/40">
				<DialogPanel className="flex w-full max-w-sm flex-col items-center rounded-lg bg-background-700 p-5 shadow-xl">
					<DialogTitle className="text-center font-bold text-white text-xl">{language.create_work_record}</DialogTitle>
					<Description className="mt-2 text-center text-white/80">{language.create_work_record_desc}</Description>
					<div className="mt-5 flex w-full select-none flex-col gap-y-2">
						<div className="flex flex-col gap-y-1">
							<div className="shrink-0 text-sm text-white/80">{language.type}:</div>
							<Dropdown selected={type} onChange={setType} color="background-800" options={typeOptions} className="w-max" />
						</div>
						<div className="flex flex-col gap-y-1">
							<div className="shrink-0 text-sm text-white/80">{language.date}:</div>
							<div className="relative">
								<input
									type="date"
									onChange={onDateChange}
									className="w-full rounded-sm bg-background-800 px-2 py-1 text-white [&::-webkit-calendar-picker-indicator]:opacity-0"
								/>
								<IconMingcuteCalendar2Fill className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 size-6 text-white/80" />
							</div>
						</div>
						{(type.value === WorkType.ONSITE || type.value === WorkType.REMOTE) && (
							<div className="flex w-full gap-x-2">
								<div className="flex w-full flex-col gap-y-1">
									<div className="shrink-0 text-sm text-white/80">{language.entry_time}:</div>
									<div className="flex items-center justify-center gap-x-1 rounded-md bg-background-900 p-1">
										<Dropdown selected={entryHour} onChange={setEntryHour} color="background-800" options={hourOptions} />
										<div className="text-white">:</div>
										<Dropdown selected={entryMinute} onChange={setEntryMinute} color="background-800" options={minuteOptions} />
									</div>
								</div>
								<div className="flex w-full flex-col gap-y-1">
									<div className="shrink-0 text-sm text-white/80">{language.exit_time}:</div>
									<div className="flex items-center justify-center gap-x-1 rounded-md bg-background-900 p-1">
										<Dropdown selected={exitHour} onChange={setExitHour} color="background-800" options={hourOptions} />
										<div className="text-white">:</div>
										<Dropdown selected={exitMinute} onChange={setExitMinute} color="background-800" options={minuteOptions} />
									</div>
								</div>
							</div>
						)}
					</div>
					<div className="mt-5 flex w-full gap-x-2">
						<Button onClick={close} color="background-800">
							{language.cancel}
						</Button>
						<Button onClick={create} color="primary">
							{language.create}
						</Button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
}
