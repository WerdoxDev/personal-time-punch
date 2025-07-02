import { createHashRouter } from "react-router";
import Root from "./root";
import AuthLayout from "./routes/auth/auth-layout";
import Login from "./routes/auth/login";
import Register from "./routes/auth/register";
import Index from "./routes/index";
import Layout from "./routes/layout";

const router = createHashRouter([
	{
		Component: Root,
		children: [
			{
				Component: Layout,
				children: [
					{
						path: "/",
						Component: Index,
					},
					{
						Component: AuthLayout,
						children: [
							{
								path: "/register",
								Component: Register,
							},
							{
								path: "/login",
								Component: Login,
							},
						],
					},
				],
			},
		],
	},
]);

export default router;
