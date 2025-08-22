import clsx from "clsx";
import type { ReactNode } from "react";

type Color = "primary" | "background-700" | "background-800" | "background-900" | "negative";
const colors: Record<Color, string> = {
	primary: "bg-primary disabled:hover:bg-primary hover:bg-primary/80 active:bg-primary/60",
	"background-700": "bg-background-700 disabled:hover:bg-background-700 hover:bg-background-700/80 active:bg-background-700/60",
	"background-800": "bg-background-800 disabled:hover:bg-background-800 hover:bg-background-800/80 active:bg-background-800/60",
	"background-900": "bg-background-900 disabled:hover:bg-background-900 hover:bg-background-900/80 active:bg-background-900/60",
	negative: "bg-rose-700 disabled:hover:bg-rose-700 hover:bg-rose-700/80 active:bg-rose-700/60",
};

export default function Button(props: { onClick?: () => void; className?: string; children?: ReactNode; color: Color }) {
	return (
		<button
			onClick={props.onClick}
			className={clsx(
				"flex h-8 w-full cursor-pointer items-center justify-center rounded-sm px-2 text-center text-white shadow-sm outline-none transition-colors disabled:cursor-default",
				colors[props.color],
				props.className,
			)}
			type="button"
		>
			{props.children}
		</button>
	);
}
