import Icon from "@components/Icon";
import Input from "@components/Input";
import { Link } from "react-router";

export default function Login() {
	return (
		<div className="flex flex-col justify-center">
			<div className="flex w-full flex-col items-center justify-center gap-y-1">
				<Icon className="size-14 text-accent" />
				<div className="text-center font-semibold text-white text-xl">
					Welcome back to <span className="text-accent">PTP</span>
				</div>
				<div className="text-center text-sm text-white/50">
					Don't have an account?{" "}
					<Link to="/register" className="text-accent/80 hover:underline">
						Register
					</Link>
				</div>
			</div>
			<div className="mt-8 flex flex-col gap-y-3">
				<Input placeholder="Email / Username" />
				<Input placeholder="Password" />
			</div>
			<div className="mt-3">
				<button
					className="w-full cursor-pointer rounded-sm bg-primary px-2 py-1.5 text-center text-white transition-colors hover:bg-primary/80 active:bg-primary/60"
					type="button"
				>
					Login
				</button>
			</div>
		</div>
	);
}
