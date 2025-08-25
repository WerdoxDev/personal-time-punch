import Icon from "@components/Icon";
import Input from "@components/Input";
import LoadingButton from "@components/LoadingButton";
import { apiRequest, getError } from "@lib/utils";
import { useAPI } from "@stores/apiStore";
import { useLanguage } from "@stores/languageStore";
import { useModals } from "@stores/modalsStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { APIPostRegisterJSONBody, APIPostRegisterResult, PTPError } from "shared";

export default function Register() {
	const navigate = useNavigate();
	const { updateModals } = useModals();
	const { initialize } = useAPI();
	const { language } = useLanguage();

	const [username, setUsername] = useState<string>("");
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const { mutateAsync, isPending } = useMutation({
		async mutationFn() {
			const body: APIPostRegisterJSONBody = {
				username,
				firstName,
				lastName,
				email,
				password,
			};

			const response = await apiRequest("/auth/register", "POST", body);
			const error = await getError(response);
			if (error) {
				throw error;
			}

			return response;
		},
		onError(error: PTPError) {
			updateModals({
				info: { isOpen: true, status: "error", text: language[error.type as keyof typeof language], title: language.register_failed },
			});
		},
		async onSuccess(response) {
			const data: APIPostRegisterResult = await response.json();
			localStorage.setItem("token", data.token);
			initialize(data.token, data.user);

			navigate("/app");
		},
	});

	async function register() {
		if (!username || !firstName || !lastName || !email || !password) {
			updateModals({ info: { isOpen: true, status: "error", text: language.fill_all_fields, title: language.login_failed } });
			return;
		}

		await mutateAsync();
	}

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await register();
			}}
		>
			<div className="flex flex-col justify-center">
				<div className="flex w-full flex-col items-center justify-center gap-y-1">
					<Icon className="size-14 text-accent" />
					<div className="text-center font-semibold text-white text-xl">
						{language.welcome_to} <span className="text-accent">PTP</span>
					</div>
					<div className="text-center text-sm text-white/50">
						{language.already_have_account}{" "}
						<Link to="/login" className="text-accent/80 hover:underline">
							{language.login}
						</Link>
					</div>
				</div>
				<div className="mt-8 flex flex-col gap-y-5">
					<Input label={language.username} placeholder="e.g Matin" value={username} onChange={setUsername} />
					<div className="flex items-center justify-center gap-x-3">
						<Input label={language.first_name} value={firstName} onChange={setFirstName} />
						<Input label={language.last_name} value={lastName} onChange={setLastName} />
					</div>
					<Input label={language.email} placeholder="example@gmail.com" value={email} onChange={setEmail} />
					<Input label={language.password} type="password" value={password} onChange={setPassword} />
				</div>

				<div className="mt-3">
					<LoadingButton type="submit" loading={isPending}>
						{language.register}
					</LoadingButton>
				</div>
			</div>
		</form>
	);
}
