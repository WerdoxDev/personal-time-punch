import clsx from "clsx";
import { type InputHTMLAttributes, useRef } from "react";

export default function Input(props: {
	label: string;
	placeholder?: string;
	className?: string;
	type?: InputHTMLAttributes<HTMLInputElement>["type"];
	value: string;
	onChange: (value: string) => void;
}) {
	const id = useRef(Math.random().toString());
	return (
		<div className="relative w-full">
			<label className="-top-3 absolute ml-0 rounded-sm rounded-b-none bg-background-700 px-1 text-white/60 text-xs" htmlFor={id.current}>
				{props.label}
			</label>
			<input
				type={props.type}
				id={id.current}
				className={clsx(
					"w-full rounded-sm rounded-tl-none bg-background-700 px-2 py-1.5 text-sm text-white placeholder-white/50 outline-none",
					props.className,
				)}
				placeholder={props.placeholder}
				onChange={(e) => props.onChange(e.target.value)}
				value={props.value}
			/>
		</div>
	);
}
