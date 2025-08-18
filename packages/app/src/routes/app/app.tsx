import Button from "@components/Button";
import { useCreateWork } from "@hooks/useCreateWork";
import { useLogout } from "@hooks/useLogout";
import { useUpdateWork } from "@hooks/useUpdateWork";
import { getWorkOptions } from "@lib/queries";
import { formatElapsedSeconds, formatTimestamp } from "@lib/utils";
import { useAPI } from "@stores/apiStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

type DayStatus = "running" | "paused" | "stopped";

export default function App() {
	const { user } = useAPI();
	const logout = useLogout();
	const navigate = useNavigate();
	const workId = localStorage.getItem("work-id") ?? "";
	const hasWorkId = !!workId;
	const { data, isLoading, error } = useQuery(getWorkOptions(workId, hasWorkId));
	const createWorkMutation = useCreateWork();
	const updateWorkMutation = useUpdateWork();

	const startTimestamp = useMemo(() => (data ? new Date(data.startTime).getTime() : undefined), [data]);
	const endTimestamp = useMemo(() => (data?.endTime ? new Date(data.endTime).getTime() : undefined), [data]);

	const [status, setStatus] = useState<DayStatus>((localStorage.getItem("status") as DayStatus) ?? "stopped");
	const [elapsed, setElapsed] = useState(0);

	const formattedTime = useMemo(() => formatElapsedSeconds(elapsed), [elapsed]);
	const formattedStartTime = useMemo(() => formatTimestamp(startTimestamp ?? 0), [startTimestamp]);
	const formattedEndTime = useMemo(() => formatTimestamp(endTimestamp ?? 0), [endTimestamp]);

	async function beginDay() {
		const dayOfWeek = new Date().getDay();

		if (createWorkMutation.isPending) {
			return;
		}

		const createdWork = await createWorkMutation.mutateAsync({ startTime: new Date().toISOString(), dayOfWeek });

		if (createdWork) {
			localStorage.setItem("work-id", createdWork.id);
		}

		setStatus("running");
	}

	async function endDay() {
		if (updateWorkMutation.isPending) {
			return;
		}

		await updateWorkMutation.mutateAsync({ id: workId, endTime: new Date().toISOString() });

		setStatus("stopped");
	}

	async function goToPanel() {
		await navigate("/panel");
		window.electronAPI.resize(1200, 680);
	}

	useEffect(() => {
		localStorage.setItem("status", status);

		if (status !== "running") {
			setElapsed(Math.floor(((endTimestamp ?? 0) - (startTimestamp ?? 0)) / 1000));
			return;
		}

		if (!data) {
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
	}, [status, data]);

	useEffect(() => {
		if (error) {
			localStorage.removeItem("work-id");
			setStatus("stopped");
		}
	}, [error]);

	return (
		<div className="relative flex h-full flex-col items-center justify-between">
			<div className="mt-10 text-2xl text-white">
				Welcome <span className="text-accent">{user?.username}</span>
			</div>
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div className="flex flex-col items-start">
					{isLoading ? (
						<div className="text-white text-xl">Loading...</div>
					) : (
						<>
							<div className="font-bold text-5xl text-white">{formattedTime}</div>
							{startTimestamp ? <div className="text-white/50 text-xl">Begin: {formattedStartTime}</div> : null}
							{endTimestamp ? <div className="text-white/50 text-xl">End: {formattedEndTime}</div> : null}
						</>
					)}
				</div>
			</div>
			{!isLoading && (
				<div className="mb-5 flex flex-col gap-y-2">
					{status === "stopped" && (
						<Button className="h-10 text-lg" onClick={beginDay}>
							Begin day
						</Button>
					)}
					{status === "running" && (
						<Button className="h-10 text-lg" onClick={endDay}>
							End day
						</Button>
					)}
					<Button onClick={goToPanel} className="h-10 text-lg">
						Go to Panel
					</Button>
				</div>
			)}
			{/* <Button onClick={logout} className="w-max">
				Logout
			</Button> */}
		</div>
	);
}
