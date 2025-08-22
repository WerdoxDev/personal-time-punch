import type { ClockTime } from "@lib/types";
import clsx from "clsx";
import { type MouseEvent, useEffect, useRef, useState } from "react";

export default function ClockFace(props: { time: ClockTime; onTimeChanged?: (time: ClockTime) => void }) {
	const [angle, setAngle] = useState<number>(0);
	const centerRef = useRef<HTMLDivElement>(null);
	const [mode, setMode] = useState<"hour" | "minute" | "none">("hour");

	useEffect(() => {
		if (props.time.hour === undefined && props.time.minute === undefined) {
			setMode("hour");
		} else if (props.time.hour !== undefined && props.time.minute === undefined) {
			setMode("minute");
		} else if (props.time.finished) {
			setMode("none");
		}
	}, [props.time]);

	function getAngle(e: MouseEvent, clamp?: number) {
		if (!centerRef.current) {
			return 0;
		}

		const rect = centerRef.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const mouseX = e.clientX - centerX;
		const mouseY = e.clientY - centerY;
		let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI) + 90;

		if (clamp) {
			angle = Math.round(angle / clamp) * clamp;
		}

		return angle;
	}

	function getClockIndex() {
		if (angle === undefined) return -1;
		return Math.round((angle / 30 + 12) % 12) || 0;
	}

	function onMouseMove(e: MouseEvent) {
		if (mode === "none") {
			return;
		}

		const angle = getAngle(e, 30);
		setAngle(angle);
	}

	function onClick(index: number) {
		if (mode === "hour") {
			props.onTimeChanged?.({ hour: index, minute: props.time.minute, finished: props.time.minute !== undefined });
		} else {
			props.onTimeChanged?.({ hour: props.time.hour, minute: index * 5, finished: props.time.hour !== undefined });
		}
		// if (mode === "hour") {
		// 	const selectedHour = Math.round((angle / 30 + 12) % 12) || 0;
		// 	props.onTimeChanged?.({ hour: selectedHour, minute: props.time.minute, finished: props.time.minute !== undefined });
		// } else if (mode === "minute") {
		// 	const selectedMinute = ((Math.round((angle / 30 + 12) % 12) || 12) * 5) % 60;
		// 	props.onTimeChanged?.({ hour: props.time.hour, minute: selectedMinute, finished: props.time.hour !== undefined });
		// }
	}

	return (
		<div className="relative h-60 w-60">
			<div className="absolute inset-0 rounded-full border-4 border-background-800">
				{/* Clock numbers */}
				{[...Array(12)].map((_, i) => {
					const match = getClockIndex() === i;
					return (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: no need
							key={i}
							className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-full cursor-pointer"
							style={{ transform: `rotate(${i * 30}deg)` }}
							onClick={() => onClick(i)}
						>
							<div
								className={clsx(
									"-translate-x-1/2 absolute top-0 left-1/2 flex h-7 w-7 items-center justify-center rounded-full text-center text-white",
									match && " bg-primary font-bold",
								)}
								style={{ transform: `rotate(-${i * 30}deg)` }}
							>
								{mode === "hour" ? (i === 0 ? "12" : i) : i * 5}
							</div>
						</div>
					);
				})}
				{mode !== "minute" &&
					[...Array(12)].map((_, i) => {
						const match = getClockIndex() === i && (mode === "hour" || props.time.hour !== undefined);
						return (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: no need
								key={i}
								className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-2/3 cursor-pointer"
								style={{ transform: `rotate(${i * 30}deg)` }}
							>
								<div
									className={clsx(
										"-translate-x-1/2 absolute top-0 left-1/2 flex h-7 w-7 items-center justify-center rounded-full text-center text-white",
										match && " bg-primary font-bold",
									)}
									style={{ transform: `rotate(-${i * 30}deg)` }}
								>
									{i === 0 ? "24" : i + 12}
								</div>
							</div>
						);
					})}
				{/* Clock hands */}
				<div className="-translate-x-1/2 absolute bottom-1/2 left-1/2 h-23 w-1 origin-bottom bg-primary" style={{ rotate: `${angle}deg` }} />
				<div ref={centerRef} className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-white" />
			</div>
		</div>
	);
}
