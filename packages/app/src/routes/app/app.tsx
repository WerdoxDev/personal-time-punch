import Button from "@components/Button";
import { useLogout } from "@hooks/useLogout";
import { useAPI } from "@stores/apiStore";

export default function App() {
	const { user } = useAPI();
	const logout = useLogout();
	return (
		<>
			<div className="text-white">
				Welcome <span className="text-accent">{user?.email}</span>
			</div>
			<Button onClick={logout} className="w-max">
				Logout
			</Button>
		</>
	);
}
