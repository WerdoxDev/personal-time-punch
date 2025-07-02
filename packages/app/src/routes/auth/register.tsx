import Icon from "@components/Icon";
import Input from "@components/Input";
import LoadingButton from "@components/LoadingButton";
import { apiHost, apiPath } from "@lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";

export default function Register() {
	const [username, setUsername] = useState<string>("");
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const { mutateAsync, isPending } = useMutation({
		async mutationFn() {
			const body = {
				username,
				firstName,
				lastName,
				email,
				password,
			};
			await fetch(apiPath("/auth/login"), { method: "POST", body: JSON.stringify(body) });
		},
	});

	async function register() {
		await mutateAsync();
	}

	return (
		<div className="flex flex-col justify-center">
			<div className="flex w-full flex-col items-center justify-center gap-y-1">
				<Icon className="size-14 text-accent" />
				<div className="text-center font-semibold text-white text-xl">
					Welcome to <span className="text-accent">PTP</span>
				</div>
				<div className="text-center text-sm text-white/50">
					Already have an account?{" "}
					<Link to="/login" className="text-accent/80 hover:underline">
						Login
					</Link>
				</div>
			</div>
			<div className="mt-8 flex flex-col gap-y-3">
				<Input placeholder="Username" value={username} onChange={setUsername} />
				<div className="flex items-center justify-center gap-x-3">
					<Input placeholder="First name" value={firstName} onChange={setFirstName} />
					<Input placeholder="Last name" value={lastName} onChange={setLastName} />
				</div>
				<Input placeholder="Email" value={email} onChange={setEmail} />
				<Input placeholder="Password" value={password} onChange={setPassword} />
			</div>

			<div className="mt-3">
				<LoadingButton onClick={register} loading={isPending}>
					Register
				</LoadingButton>
			</div>
		</div>
	);
}
