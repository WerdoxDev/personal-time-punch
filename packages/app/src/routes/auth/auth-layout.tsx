import { useLanguage } from "@stores/languageStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router";

export default function AuthLayout() {
	const queryClient = useQueryClient();
	const { currentLanguage, setLanguage } = useLanguage();

	useEffect(() => {
		queryClient.removeQueries({ queryKey: ["work"] });
		queryClient.removeQueries({ queryKey: ["works"] });
		queryClient.removeQueries({ queryKey: ["latest-work"] });
	}, []);

	function switchLanguage() {
		if (currentLanguage === "en") {
			setLanguage("de");
		} else {
			setLanguage("en");
		}
	}

	return (
		<div className="relative flex h-full w-full items-center justify-center bg-background-900">
			<div className="w-full max-w-sm rounded-lg bg-background-800 p-5 shadow-xl">
				<button onClick={switchLanguage} type="button" className="absolute top-2 right-2 cursor-pointer rounded-md">
					{currentLanguage === "de" ? <IconTwemojiFlagUnitedKingdom className="size-7" /> : <IconTwemojiFlagGermany className="size-7" />}
				</button>
				<Outlet />
			</div>
		</div>
	);
}
