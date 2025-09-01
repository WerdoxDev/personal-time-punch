import { Checkbox } from "@headlessui/react";
import { useState } from "react";

export default function PCheckbox(props: { isChecked: boolean; onChange?: (isChecked: boolean) => void }) {
	// const [isChecked, setIsChecked] = useState(false);

	function onChange(isChecked: boolean) {
		props.onChange?.(isChecked);
	}

	return (
		<Checkbox checked={props.isChecked} onChange={onChange} className="group flex size-7 shrink-0 cursor-pointer rounded-md bg-background-800 p-1">
			<IconMingcuteCheckFill className="hidden size-5 text-white group-data-checked:block" />
		</Checkbox>
	);
}
