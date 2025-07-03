import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import LoadingIcon from "./LoadingIcon";

export default function LoadingButton(props: {
	onClick?: () => void;
	loading: boolean;
	className?: string;
	type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
	children?: ReactNode;
}) {
	return (
		<button
			onClick={props.onClick}
			className={clsx(
				"flex h-8 w-full cursor-pointer items-center justify-center rounded-sm bg-primary px-2 text-center text-white shadow-md outline-none transition-colors hover:bg-primary/80 active:bg-primary/60 disabled:cursor-default disabled:hover:bg-primary",
				props.className,
			)}
			disabled={props.loading}
			type={props.type ?? "button"}
		>
			{props.loading ? <LoadingIcon className="size-7" /> : props.children}
		</button>
	);
}
