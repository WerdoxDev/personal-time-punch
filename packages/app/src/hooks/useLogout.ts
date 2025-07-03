import { useAPI } from "@stores/apiStore";
import { useNavigate } from "react-router";

export function useLogout() {
	const { setToken, setUser } = useAPI();
	const navigate = useNavigate();

	function logout() {
		setToken("");
		setUser(undefined);

		navigate("/login");
	}

	return logout;
}
