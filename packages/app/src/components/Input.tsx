import clsx from "clsx";

export default function Input(props: { placeholder: string; className?: string; value: string; onChange: (value: string) => void }) {
	return (
		<input
			placeholder={props.placeholder}
			className={clsx("w-full rounded-sm bg-background-700 px-2 py-1.5 text-sm text-white placeholder-white/60 outline-none", props.className)}
			onChange={(e) => props.onChange(e.target.value)}
			value={props.value}
		/>
	);
}
