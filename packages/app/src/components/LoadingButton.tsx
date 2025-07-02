import clsx from "clsx";
import type { ReactNode } from "react";
import LoadingIcon from "./LoadingIcon";

export default function LoadingButton(props: { onClick: () => void; loading: boolean; className?: string; children?: ReactNode }) {
	return (
		<button
			onClick={props.onClick}
			className={clsx(
				"flex h-8 w-full cursor-pointer items-center justify-center rounded-sm bg-primary px-2 text-center text-white transition-colors hover:bg-primary/80 active:bg-primary/60 disabled:cursor-default disabled:hover:bg-primary",
				props.className,
			)}
			disabled={props.loading}
			type="button"
		>
			{props.loading ? <LoadingIcon className="size-7" /> : props.children}
		</button>
	);
}
