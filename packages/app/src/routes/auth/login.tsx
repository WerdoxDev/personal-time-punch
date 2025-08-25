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
import type { APIPostLoginJSONBody, APIPostLoginResult, PTPError } from "shared";

export default function Login() {
	const navigate = useNavigate();
	const { updateModals } = useModals();
	const { initialize } = useAPI();
	const { language } = useLanguage();

	const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const { mutateAsync, isPending } = useMutation({
		async mutationFn() {
			const body: APIPostLoginJSONBody = {
				login: usernameOrEmail,
				password,
			};

			const response = await apiRequest("/auth/login", "POST", body);
			const error = await getError(response);
			if (error) {
				throw error;
			}

			return response;
		},
		onError(error: PTPError) {
			updateModals({ info: { isOpen: true, status: "error", text: language[error.type as keyof typeof language], title: language.login_failed } });
		},
		async onSuccess(response) {
			const data: APIPostLoginResult = await response.json();
			localStorage.setItem("token", data.token);
			initialize(data.token, data.user);

			navigate("/app");
		},
	});

	async function login() {
		if (!login || !password) {
			updateModals({ info: { isOpen: true, status: "error", text: language.fill_all_fields, title: language.login_failed } });
			return;
		}

		await mutateAsync();
	}

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await login();
			}}
		>
			<div className="flex flex-col justify-center">
				<div className="flex w-full flex-col items-center justify-center gap-y-1">
					<Icon className="size-14 text-accent" />
					<div className="text-center font-semibold text-white text-xl">
						{language.welcome_back} <span className="text-accent">PTP</span>
					</div>
					<div className="text-center text-sm text-white/50">
						{language.dont_have_account}{" "}
						<Link to="/register" className="text-accent/80 hover:underline">
							{language.register}
						</Link>
					</div>
				</div>
				<div className="mt-8 flex flex-col gap-y-5">
					<Input label={`${language.email} / ${language.username}`} value={usernameOrEmail} onChange={setUsernameOrEmail} />
					<Input label={language.password} type="password" value={password} onChange={setPassword} />
				</div>
				<div className="mt-3">
					<LoadingButton type="submit" loading={isPending}>
						{language.login}
					</LoadingButton>
				</div>
			</div>
		</form>
	);
}
