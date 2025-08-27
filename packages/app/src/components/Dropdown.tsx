import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import type { DropdownOption } from "@lib/types";
import clsx from "clsx";
import type { Key } from "react";

type Color = "primary" | "background-700" | "background-800" | "background-900";
const colors: Record<Color, string> = {
	primary: "bg-primary",
	"background-700": "bg-background-700",
	"background-800": "bg-background-800",
	"background-900": "bg-background-900",
};

export function Dropdown<T>(props: {
	className?: string;
	color: Color;
	options: DropdownOption<T>[];
	selected: DropdownOption<T>;
	onChange?: (selected: DropdownOption<T>) => void;
	anchor?: { gap?: number; padding?: number };
}) {
	return (
		<div className="relative w-full">
			<Listbox value={props.selected} onChange={props.onChange}>
				<ListboxButton
					className={clsx(
						"relative flex w-full cursor-pointer items-center justify-center gap-x-1 rounded-sm px-2 py-1 text-white outline-none",
						colors[props.color],
						props.className,
					)}
				>
					{({ open }) => (
						<>
							{props.selected.text}
							<div className="ml-auto">{open ? <IconMingcuteUpFill /> : <IconMingcuteDownFill />}</div>
						</>
					)}
				</ListboxButton>
				<ListboxOptions
					anchor={{ gap: props.anchor?.gap ?? 8, padding: props.anchor?.padding ?? 40, to: "bottom start" }}
					className={clsx(colors[props.color], "flex flex-col gap-y-1 rounded-sm bg-background-900 p-1 shadow-sm outline-none")}
				>
					{props.options.map((x) => (
						<ListboxOption key={x.value as Key} value={x} className="cursor-pointer rounded px-2 py-1 text-left text-white hover:bg-white/10">
							{x.text}
						</ListboxOption>
					))}
				</ListboxOptions>
			</Listbox>
		</div>
	);
}
