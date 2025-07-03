import Button from "@components/Button";
import { useLogout } from "@hooks/useLogout";
import { formatElapsedSeconds, formatTimestamp } from "@lib/utils";
import { useAPI } from "@stores/apiStore";
import { useEffect, useMemo, useRef, useState } from "react";

type DayStatus = "running" | "paused" | "stopped";

export default function App() {
	const { user } = useAPI();
	const logout = useLogout();

	const [status, setStatus] = useState<DayStatus>((localStorage.getItem("status") as DayStatus) ?? "stopped");
	const [startTimestamp, setStartTimestamp] = useState<number | undefined>(Number(localStorage.getItem("start-timestamp")) ?? undefined);
	const [endTimestamp, setEndTimestamp] = useState<number | undefined>(Number(localStorage.getItem("end-timestamp")) ?? undefined);
	const [elapsed, setElapsed] = useState(0);

	const formattedTime = useMemo(() => formatElapsedSeconds(elapsed), [elapsed]);
	const formattedStartTime = useMemo(() => formatTimestamp(startTimestamp ?? 0), [startTimestamp]);
	const formattedEndTime = useMemo(() => formatTimestamp(endTimestamp ?? 0), [endTimestamp]);

	function beginDay() {
		setStatus("running");
		setStartTimestamp(Date.now());
		setEndTimestamp(undefined);
		localStorage.setItem("start-timestamp", Date.now().toString());
		localStorage.removeItem("end-timestamp");
	}

	function endDay() {
		setStatus("stopped");
		setEndTimestamp(Date.now());
		localStorage.setItem("end-timestamp", Date.now().toString());
	}

	useEffect(() => {
		console.log(startTimestamp, endTimestamp);
		localStorage.setItem("status", status);

		if (status !== "running") {
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
	}, [status]);

	return (
		<div className="relative flex h-full flex-col items-center justify-between">
			<div className="mt-10 text-2xl text-white">
				Welcome <span className="text-accent">{user?.username}</span>
			</div>
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div className="flex flex-col items-start">
					<div className="font-bold text-5xl text-white">{formattedTime}</div>
					{startTimestamp ? <div className="text-white/50 text-xl">Begin: {formattedStartTime}</div> : null}
					{endTimestamp ? <div className="text-white/50 text-xl">End: {formattedEndTime}</div> : null}
				</div>
			</div>
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
				<Button onClick={() => {}} className="h-10 text-lg">
					Go to Panel
				</Button>
			</div>
			{/* <Button onClick={logout} className="w-max">
				Logout
			</Button> */}
		</div>
	);
}
