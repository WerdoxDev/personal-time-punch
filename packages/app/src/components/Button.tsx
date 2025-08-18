import clsx from "clsx";
import type { ReactNode } from "react";

export default function Button(props: { onClick?: () => void; className?: string; children?: ReactNode }) {
	return (
		<button
			onClick={props.onClick}
			className={clsx(
				"flex h-8 w-full cursor-pointer items-center justify-center rounded-sm bg-primary px-2 text-center text-white shadow-md outline-none transition-colors hover:bg-primary/80 active:bg-primary/60 disabled:cursor-default disabled:hover:bg-primary",
				props.className,
			)}
			type="button"
		>
			{props.children}
		</button>
	);
}
