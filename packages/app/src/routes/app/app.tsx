import Button from "@components/Button";
import { Dropdown } from "@components/Dropdown";
import { useCreateWork } from "@hooks/useCreateWork";
import { useLogout } from "@hooks/useLogout";
import { useUpdateWork } from "@hooks/useUpdateWork";
import { getLatestWorkOptions } from "@lib/queries";
import type { DropdownOption } from "@lib/types";
import { useAPI } from "@stores/apiStore";
import { useModals } from "@stores/modalsStore";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { WorkType } from "shared";

const typeOptions: DropdownOption<WorkType>[] = [
	{ text: "Onsite", value: WorkType.ONSITE },
	{ text: "Remote", value: WorkType.REMOTE },
];

export default function App() {
	const { user } = useAPI();
	const navigate = useNavigate();
	const { data, isLoading, refetch } = useQuery(getLatestWorkOptions());
	const createWorkMutation = useCreateWork();
	const updateWorkMutation = useUpdateWork();
	const logout = useLogout();
	const { updateModals } = useModals();

	const [startTimestamp, setStartTimestamp] = useState<number | undefined>(undefined);
	const [endTimestamp, setEndTimestamp] = useState<number | undefined>(undefined);

	const [isRunning, setIsRunning] = useState(false);
	const [elapsed, setElapsed] = useState(0);

	const [type, setType] = useState<DropdownOption<WorkType>>(typeOptions[0]);

	async function startSession() {
		if (createWorkMutation.isPending) {
			return;
		}

		const createdWork = await createWorkMutation.mutateAsync({
			timeOfEntry: new Date().toISOString(),
			type: type.value,
		});

		if (createdWork) {
			await refetch();

			setStartTimestamp(new Date(createdWork.timeOfEntry).getTime());
			setEndTimestamp(undefined);
		}
	}

	async function endSession() {
		if (updateWorkMutation.isPending || !data) {
			return;
		}

		const updatedWork = await updateWorkMutation.mutateAsync({ id: data.id, timeOfExit: new Date().toISOString() });

		if (updatedWork?.timeOfExit) {
			await refetch();
			setIsRunning(false);

			setEndTimestamp(new Date(updatedWork.timeOfExit).getTime());
		}
	}

	async function goToPanel() {
		await navigate("/panel");
		window.electronAPI.resize(1050, 800);
	}

	function about() {
		updateModals({
			info: {
				isOpen: true,
				status: "info",
				onConfirm: undefined,
				title: "About PTP",
				text: (
					<div className="">
						Made by{" "}
						<button
							type="button"
							className="cursor-pointer font-bold text-accent hover:underline"
							onClick={() => window.electronAPI.openExternal("https://github.com/WerdoxDev")}
						>
							Matin Tat
						</button>
						<div className="text-sm">© 2025 Nanowired. All rights reserved.</div>
					</div>
				),
			},
		});
	}

	useEffect(() => {
		if (!isRunning) {
			setElapsed(Math.floor(((endTimestamp ?? 0) - (startTimestamp ?? 0)) / 1000));
			return;
		}

		tick();

		function tick() {
			const now = Date.now();
			const diffInSeconds = Math.floor((now - (startTimestamp ?? 0)) / 1000);
			setElapsed(diffInSeconds);
		}

		const interval = setInterval(tick, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [isRunning]);

	useEffect(() => {
		if (data) {
			setStartTimestamp(new Date(data.timeOfEntry).getTime());
		}
		if (data && !data?.timeOfExit) {
			setIsRunning(true);
		}
	}, [data]);

	useEffect(() => {
		window.electronAPI.resize(480, 480);
	}, []);

	return (
		<div className="relative flex h-full flex-col items-center justify-between">
			<div className="mt-10 text-2xl text-white">
				Welcome <span className="font-bold text-accent">{user?.username}</span>
			</div>
			<button onClick={() => logout()} type="button" className="absolute top-2 right-2 cursor-pointer rounded-md bg-rose-400 p-1">
				<IconMingcuteExitFill className="text-white" />
			</button>
			<button onClick={() => about()} type="button" className="absolute top-2 left-2 cursor-pointer rounded-md bg-green-500 p-1">
				<IconMingcuteInformationFill className="text-white" />
			</button>
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div className="flex flex-col items-start">
					{isLoading ? (
						<div className="text-white text-xl">Loading...</div>
					) : (
						<>
							<div className="font-bold text-5xl text-white">{moment.utc(elapsed * 1000).format("H[h] m[m] ss[s]")}</div>
							{startTimestamp ? <div className="text-white/50 text-xl">Entry: {moment(startTimestamp).format("DD.MM.YYYY HH:mm")}</div> : null}
							{endTimestamp ? <div className="text-white/50 text-xl">Exit: {moment(endTimestamp).format("DD.MM.YYYY HH:mm")}</div> : null}
						</>
					)}
				</div>
			</div>
			{!isLoading && (
				<div className="flex w-full items-end p-5">
					<Button color="primary" onClick={goToPanel} className="h-10 w-max text-lg">
						Go to Panel
					</Button>
					<div className="ml-auto flex flex-col gap-y-2">
						{!isRunning && (
							<>
								<div className="flex flex-col gap-y-1">
									<div className="shrink-0 text-sm text-white/80">Session Type:</div>
									<Dropdown selected={type} onChange={setType} color="background-800" options={typeOptions} anchor={{ padding: 0 }} />
								</div>
								<Button color="primary" className="h-10 w-max text-lg" onClick={startSession}>
									Start session
								</Button>
							</>
						)}
						{isRunning && (
							<Button color="primary" className="h-10 w-max text-lg" onClick={endSession}>
								End session
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
